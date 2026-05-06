# agent-context/
## Thư mục điều phối AI Agents — BFMS Project

Thư mục này là **não bộ chung** của tất cả AI Agents làm việc trên dự án BFMS.  
Không cần giữ PDF gốc trong project root. Mọi thông tin đã được distill vào đây.

---

## Cấu trúc

```
agent-context/
├── README.md                   ← File này — đọc đầu tiên
├── AGENT_INSTRUCTIONS.md       ← Quy trình bắt buộc cho mọi agent
├── PROJECT_CONTEXT.md          ← SRS + SDD + API Spec đã tóm tắt
├── PROJECT_MEMORY.md           ← Trí nhớ tích lũy qua các session
├── CODING_CONVENTIONS.md       ← Quy ước code duy nhất
├── jira-tasks.md               ← Tasks hiện tại (auto-generated)
├── sync-jira.sh                ← Script lấy tasks từ Jira API
└── documents_md/
    └── BFMS_API.md
    └── BFMS_SDD.md
    └── BFMS_SRS.md
```

---

## Bắt đầu nhanh cho Agent mới

```
Bước 1: Đọc AGENT_INSTRUCTIONS.md
Bước 2: Đọc PROJECT_CONTEXT.md - sau đó đọc tiếp lần lượt documents_md/BFMS_SRS.md, documents_md/BFMS_SDD.md, documents_md/BFMS_API.md
Bước 3: Đọc CODING_CONVENTIONS.md
Bước 4: Đọc PROJECT_MEMORY.md
Bước 5: Đọc jira-tasks.md (nếu có task)
Bước 6: Phân tích → hỏi owner → chờ confirm → code
```

---

## Cập nhật Jira tasks

```bash
# Set API token (1 lần duy nhất, hoặc thêm vào ~/.bashrc)
export JIRA_API_TOKEN=your_atlassian_api_token

# Chỉnh sửa config trong sync-jira.sh:
# - JIRA_BASE_URL
# - JIRA_PROJECT_KEY
# - JIRA_EMAIL

# Chạy sync
chmod +x agent-context/sync-jira.sh
./agent-context/sync-jira.sh
```

---

## Nguyên tắc vàng

> **Agent không tự quyết định. Agent phân tích, đặt câu hỏi, và chờ xác nhận.**

Mọi quyết định quan trọng đều phải có sự đồng ý của owner trước khi implement.
