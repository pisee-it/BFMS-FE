#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
CONTEXT_FILE="$SCRIPT_DIR/../agent-context/jira-current-task.md"

# Load environment variables from .env file
ENV_FILE="$SCRIPT_DIR/../.env"
if [ -f "$ENV_FILE" ]; then
    # Read .env file line by line and export variables
    while IFS= read -r line || [ -n "$line" ]; do
        # Ignore comments and empty lines
        if [[ ! "$line" =~ ^# && "$line" =~ = ]]; then
            # Clean quotes if present
            CLEAN_LINE=$(echo "$line" | sed 's/=\(['"'"'"]\)\(.*\)\1/=\2/')
            export "$CLEAN_LINE"
        fi
    done < "$ENV_FILE"
fi

# Kiểm tra các biến môi trường bắt buộc
if [ -z "$JIRA_DOMAIN" ] || [ -z "$JIRA_EMAIL" ] || [ -z "$JIRA_API_TOKEN" ] || [ -z "$PROJECT_KEY" ]; then
    echo "❌ Lỗi: Thiếu cấu hình Jira trong .env"
    exit 1
fi

# Kiểm tra Python
if command -v py >/dev/null 2>&1; then PY_CMD="py";
elif command -v python3 >/dev/null 2>&1; then PY_CMD="python3";
elif command -v python >/dev/null 2>&1; then PY_CMD="python";
elif [ -f "/c/Users/Administrator/AppData/Local/Programs/Python/Python314/python.exe" ]; then PY_CMD="/c/Users/Administrator/AppData/Local/Programs/Python/Python314/python.exe";
elif [ -f "C:/Users/Administrator/AppData/Local/Programs/Python/Python314/python.exe" ]; then PY_CMD="C:/Users/Administrator/AppData/Local/Programs/Python/Python314/python.exe";
else echo "❌ Lỗi: Không tìm thấy Python."; exit 1; fi

echo "# 🚀 Task Hiện Tại (In Progress)" > "$CONTEXT_FILE"

# Gọi API qua POST với đầy đủ các trường yêu cầu
RESPONSE=$(curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -X POST -H "Content-Type: application/json" \
  -d "{
    \"jql\": \"project = '$PROJECT_KEY' AND status = 'In Progress' ORDER BY rank ASC\",
    \"maxResults\": 1,
    \"fields\": [\"summary\", \"description\", \"priority\", \"parent\", \"duedate\", \"subtasks\", \"status\"]
  }" \
  "https://$JIRA_DOMAIN/rest/api/3/search/jql")

# Dùng Python để xử lý logic bóc tách thông tin
$PY_CMD -c "
import sys, json, io

# Cấu hình encoding UTF-8 với chế độ xử lý lỗi 'replace'
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def get_text_from_adf(adf_obj):
    if not adf_obj: return 'N/A'
    if isinstance(adf_obj, str): return adf_obj
    if 'content' not in adf_obj: return 'N/A'
    texts = []
    for p in adf_obj.get('content', []):
        if 'content' in p:
            for item in p['content']:
                if item.get('type') == 'text': texts.append(item.get('text', ''))
                elif item.get('type') == 'hardBreak': texts.append('\n')
    return ' '.join(texts).replace(' \n ', '\n').strip() if texts else 'N/A'

try:
    # Đọc dữ liệu nhị phân và decode với 'replace' để tránh lỗi surrogate
    raw_data = sys.stdin.buffer.read().decode('utf-8', 'replace')
    data = json.loads(raw_data)
    issues = data.get('issues', [])
    
    if not issues:
        print('⚠️ Không tìm thấy task yêu cầu.')
        sys.exit(0)

    issue = issues[0]
    fields = issue.get('fields', {})
    key = issue.get('key')
    domain = \"$JIRA_DOMAIN\"

    print(f'## [{key}](https://{domain}/browse/{key}): {fields.get(\"summary\", \"N/A\")}')
    print(f'* **Status**: {fields.get(\"status\", {}).get(\"name\", \"N/A\")}')
    print(f'* **Priority**: {fields.get(\"priority\", {}).get(\"name\", \"N/A\")}')
    print(f'* **Due Date**: {fields.get(\"duedate\", \"N/A\")}')

    parent = fields.get('parent')
    if parent:
        pk = parent.get('key')
        print(f'* **Parent**: [{pk}](https://{domain}/browse/{pk}) - {parent.get(\"fields\", {}).get(\"summary\")}')
    else:
        print('* **Parent**: None')

    subtasks = fields.get('subtasks', [])
    if subtasks:
        print('\n### 📋 Subtasks')
        for sub in subtasks:
            sk = sub.get('key')
            sf = sub.get('fields', {})
            print(f'- [[{sk}](https://{domain}/browse/{sk})] {sf.get(\"summary\")} ({sf.get(\"status\", {}).get(\"name\")})')

    desc = get_text_from_adf(fields.get('description'))
    print(f'\n### 📝 Description\n{desc}')

except Exception as e:
    print(f'Error processing Jira data: {e}')
" <<< "$RESPONSE" >> "$CONTEXT_FILE"

echo "✅ Đã đồng bộ chi tiết task vào: $CONTEXT_FILE"
# Lệnh chạy: bash agent-context/sync-jira.sh
