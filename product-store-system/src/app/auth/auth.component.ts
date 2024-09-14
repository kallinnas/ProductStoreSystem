import { Component } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { AuthService } from '../services/auth.service';
import { GeneralModule } from '../modules/general.module';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiAuthService } from '../services/api-auth.service';
import { UserRegistrDto } from '../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  errorMessage = '';
  isRegisterMode: boolean = false;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public signalrService: SignalrService,
    public authService: AuthService,
    private apiAuthService: ApiAuthService,
  ) { }

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['']
    });
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    if (this.isRegisterMode) {
      const user = new UserRegistrDto(this.authForm.value.email, this.authForm.value.password, this.authForm.value.name);
      this.registerAPI(user);
    }

    else {
      this.loginAPI(this.authForm.value.email, this.authForm.value.password);
    }
  }

  
  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  loginAPI(email: string, password: string) {
    this.apiAuthService.login(email, password).subscribe({
      next: response => {
        this.authorizeUser(response.token);
      },

      error: err => this.errorMessage = 'Login failed. Please check your credentials.'
    });
  }

  registerAPI(user: UserRegistrDto) {
    this.apiAuthService.register(user).subscribe({
      next: response => {
        this.authorizeUser(response.token);
      },

      error: err => this.errorMessage = 'Registration failed. Please try again.'
    });
  }

  private authorizeUser(token: string) {
    localStorage.setItem('token', token);

    this.authService.launchHub(token)
    this.apiAuthService.checkAuthentication();
    const userRole = this.apiAuthService.getUserRole();

    if (userRole) {
      if (userRole === '1') {
        this.authService.router.navigate(['/display-connection-status']);
      }

      else {
        this.authService.router.navigate(['/edit-products']);
      }
    }
  }
}
