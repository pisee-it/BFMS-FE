import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdCompanyService } from '@core/services/ad-company.service';
import { AdCompany, AdCompanyRequest } from '@core/models/ad-company.model';

@Component({
  selector: 'app-company-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './company-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class CompanyManagementComponent implements OnInit {
  private readonly adCompanyService = inject(AdCompanyService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  companies = signal<AdCompany[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  companyDialog = signal<boolean>(false);
  companyForm: FormGroup;
  submitted = false;

  constructor() {
    this.companyForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      taxCode: ['', [Validators.required]],
      contact: ['']
    });
  }

  ngOnInit() {}

  loadCompanies(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;

    this.adCompanyService.getCompanies(page, size).subscribe({
      next: (response) => {
        this.companies.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách đối tác' });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.companyForm.reset({
      id: null,
      name: '',
      taxCode: '',
      contact: ''
    });
    this.submitted = false;
    this.companyDialog.set(true);
  }

  editCompany(company: AdCompany) {
    this.companyForm.patchValue(company);
    this.companyDialog.set(true);
  }

  deleteCompany(company: AdCompany) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa đối tác ${company.name}?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adCompanyService.deleteCompany(company.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa đối tác' });
            this.refreshTable();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa đối tác' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.companyDialog.set(false);
    this.submitted = false;
  }

  saveCompany() {
    this.submitted = true;

    if (this.companyForm.valid) {
      const companyData: AdCompanyRequest = { ...this.companyForm.value };
      const id = this.companyForm.get('id')?.value;

      const observable = id 
        ? this.adCompanyService.updateCompany(id, companyData)
        : this.adCompanyService.createCompany(companyData);

      observable.subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Thành công', 
            detail: id ? 'Đã cập nhật thông tin đối tác' : 'Đã thêm đối tác mới' 
          });
          this.companyDialog.set(false);
          this.refreshTable();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lưu thông tin đối tác' });
        }
      });
    }
  }

  refreshTable() {
    this.loadCompanies({ first: 0, rows: 10 });
  }
}
