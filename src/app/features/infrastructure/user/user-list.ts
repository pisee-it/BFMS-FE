import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '@core/services/user.service';
import { UserResponse, UserRequest, UserRole } from '@core/models/user.model';
import { SkeletonTableComponent } from '@shared/components/skeleton-table/skeleton-table';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    SkeletonTableComponent
  ],
  templateUrl: './user-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Signals for state management
  users = signal<UserResponse[]>([]);
  loading = signal<boolean>(false);
  
  userDialog = signal<boolean>(false);
  userForm: FormGroup;
  submitted = false;
  isEditMode = signal<boolean>(false);
  
  roles: UserRole[] = ['OWNER', 'ADMIN', 'STAFF', 'ACCOUNTANT', 'ADVERTISING'];

  constructor() {
    this.userForm = this.fb.group({
      id: [null],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(18)]],
      licenceType: [''],
      avatarUrl: [''],
      role: ['STAFF', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách người dùng' });
        this.loading.set(false);
      }
    });
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.userForm.reset({
      id: null,
      username: '',
      password: '',
      fullName: '',
      age: null,
      licenceType: '',
      avatarUrl: '',
      role: 'STAFF'
    });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.isEditMode.set(false);
    this.submitted = false;
    this.userDialog.set(true);
  }

  editUser(user: UserResponse) {
    this.isEditMode.set(true);
    this.userForm.patchValue({
      ...user,
      password: '' // Không hiển thị mật khẩu cũ
    });
    
    // Khi edit, mật khẩu không bắt buộc trừ khi muốn đổi
    this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.userDialog.set(true);
  }

  deleteUser(user: UserResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa người dùng ${user.fullName}?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa người dùng' });
            this.loadUsers();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa người dùng' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.userDialog.set(false);
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.userForm.valid) {
      const data = { ...this.userForm.value };
      const id = data.id;
      
      // Nếu là edit và không nhập password mới, xóa trường password khỏi data
      if (this.isEditMode() && !data.password) {
        delete data.password;
      }

      const observable = id 
        ? this.userService.updateUser(id, data)
        : this.userService.createUser(data);

      observable.subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Thành công', 
            detail: id ? 'Đã cập nhật thông tin' : 'Đã tạo người dùng mới' 
          });
          this.userDialog.set(false);
          this.loadUsers();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: err.error?.message || 'Không thể lưu thông tin' });
        }
      });
    }
  }

  getRoleClass(role: UserRole): string {
    const base = 'px-2 py-1 rounded-full text-xs font-bold ';
    switch (role) {
      case 'ADMIN':
        return base + 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'OWNER':
        return base + 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'ACCOUNTANT':
        return base + 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ADVERTISING':
        return base + 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'STAFF':
        return base + 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return base + 'bg-gray-100 text-gray-700';
    }
  }
}
