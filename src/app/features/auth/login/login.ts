import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoginRequest } from '@core/models/auth.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { LucideAngularModule, Bus, User, Lock } from 'lucide-angular';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    LucideAngularModule,
    MessageModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly BusIcon = Bus;
  readonly UserIcon = User;
  readonly LockIcon = Lock;

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.loginForm.disable();

      this.authService.login(this.loginForm.getRawValue() as LoginRequest).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.loginForm.enable();

          if (err.status === 401) {
            this.errorMessage.set('Sai tên đăng nhập hoặc mật khẩu!');
          } else if (err.status === 0) {
            this.errorMessage.set('Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend!');
          } else {
            this.errorMessage.set('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau!');
          }

          console.error('Login error:', err);
        }
      });
    }
  }
}
