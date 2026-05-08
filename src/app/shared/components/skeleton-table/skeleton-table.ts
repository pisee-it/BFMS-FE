import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [CommonModule, SkeletonModule, TableModule],
  template: `
    <div class="glass-panel p-4 animate-pulse">
      <div class="flex justify-between items-center mb-6">
        <p-skeleton width="200px" height="2rem" borderRadius="8px"></p-skeleton>
        <p-skeleton width="120px" height="2.5rem" borderRadius="8px"></p-skeleton>
      </div>
      
      <p-table [value]="skeletonRows" [rows]="rows()" class="w-full">
        <ng-template pTemplate="header">
          <tr>
            <th *ngFor="let col of [].constructor(columns())">
              <p-skeleton width="80%" height="1.2rem"></p-skeleton>
            </th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body">
          <tr>
            <td *ngFor="let col of [].constructor(columns())">
              <p-skeleton width="90%" height="1rem"></p-skeleton>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonTableComponent {
  rows = input<number>(5);
  columns = input<number>(5);

  get skeletonRows() {
    return Array(this.rows()).fill({});
  }
}
