import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdCompanyService } from '@core/services/ad-company.service';
import { RouteService } from '@core/services/route.service';
import { AdContractService } from '@core/services/ad-contract.service';
import { FileService } from '@core/services/file.service';
import { AdCompany } from '@core/models/ad-company.model';
import { BusRoute } from '@core/models/route.model';
import { AdContractRequest } from '@core/models/ad-contract.model';

@Component({
  selector: 'app-contract-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    FileUploadModule,
    ToastModule
  ],
  templateUrl: './contract-registration.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractRegistrationComponent implements OnInit {
  private readonly adCompanyService = inject(AdCompanyService);
  private readonly routeService = inject(RouteService);
  private readonly adContractService = inject(AdContractService);
  private readonly fileService = inject(FileService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  contractForm: FormGroup;
  companies = signal<AdCompany[]>([]);
  routes = signal<BusRoute[]>([]);
  uploadingFile = signal<boolean>(false);
  loading = signal<boolean>(false);
  uploadedFileUrl = signal<string>('');
  submitted = false;

  constructor() {
    this.contractForm = this.fb.group({
      companyId: [null, [Validators.required]],
      routeId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      pricePerBus: [0, [Validators.required, Validators.min(0)]],
      busQuantity: [1, [Validators.required, Validators.min(1)]],
      contractFileUrl: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadCompanies();
    this.loadRoutes();
  }

  loadCompanies() {
    this.adCompanyService.getCompanies(0, 1000).subscribe({
      next: (response) => this.companies.set(response.content)
    });
  }

  loadRoutes() {
    this.routeService.getRoutes(0, 1000).subscribe({
      next: (response) => this.routes.set(response.content)
    });
  }

  onUpload(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadingFile.set(true);
      this.fileService.uploadFile(file).subscribe({
        next: (response) => {
          // BE trả về tên file hoặc URL
          const fileName = response.fileName || response.name || file.name;
          const url = this.fileService.getFileUrl(fileName);
          this.uploadedFileUrl.set(url);
          this.contractForm.patchValue({ contractFileUrl: url });
          this.uploadingFile.set(false);
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tải lên tệp hợp đồng thành công' });
        },
        error: () => {
          this.uploadingFile.set(false);
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải lên tệp hợp đồng' });
        }
      });
    }
  }

  saveContract() {
    this.submitted = true;

    if (this.contractForm.valid) {
      const formValue = this.contractForm.value;
      
      // Chuyển đổi Date sang String (ISO hoặc YYYY-MM-DD)
      const contractData: AdContractRequest = {
        ...formValue,
        startDate: this.formatDate(formValue.startDate),
        endDate: this.formatDate(formValue.endDate)
      };

      this.loading.set(true);
      this.adContractService.createContract(contractData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo yêu cầu hợp đồng mới' });
          this.loading.set(false);
          setTimeout(() => this.router.navigate(['/advertising/contracts']), 1500);
        },
        error: (error) => {
          this.loading.set(false);
          const detail = error.error?.message || 'Không thể tạo hợp đồng';
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  goBack() {
    this.router.navigate(['/advertising/contracts']);
  }
}
