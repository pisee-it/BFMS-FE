import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AdContractService } from '@core/services/ad-contract.service';
import { AdContract } from '@core/models/ad-contract.model';

interface FileItem {
  name: string;
  url: string;
  type: 'contract' | 'decal';
  date: string;
  contractId?: number;
  companyName?: string;
}

@Component({
  selector: 'app-file-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    TooltipModule,
    NgOptimizedImage
  ],
  templateUrl: './file-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagementComponent implements OnInit {
  private readonly adContractService = inject(AdContractService);

  contracts = signal<AdContract[]>([]);
  loading = signal<boolean>(false);
  filterType = signal<'all' | 'contract' | 'decal'>('all');

  // Khám phá các tệp tin từ dữ liệu hợp đồng
  files = computed(() => {
    const allFiles: FileItem[] = [];
    
    this.contracts().forEach(c => {
      if (c.contractFileUrl) {
        allFiles.push({
          name: this.extractFileName(c.contractFileUrl),
          url: c.contractFileUrl,
          type: 'contract',
          date: c.createdAt,
          contractId: c.id,
          companyName: c.companyName
        });
      }
    });

    if (this.filterType() === 'all') return allFiles;
    return allFiles.filter(f => f.type === this.filterType());
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.adContractService.getContracts(0, 1000).subscribe({
      next: (response) => {
        this.contracts.set(response.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private extractFileName(url: string): string {
    return url.split('/').pop() || 'file_dinh_kem';
  }

  isImage(url: string): boolean {
    const ext = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  }

  setFilter(type: 'all' | 'contract' | 'decal') {
    this.filterType.set(type);
  }

  copyLink(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      // Có thể thêm toast thông báo ở đây
    });
  }
}
