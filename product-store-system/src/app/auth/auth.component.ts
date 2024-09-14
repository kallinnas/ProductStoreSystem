import { Component } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { AuthService } from '../services/auth.service';
import { GeneralModule } from '../modules/general.module';
import { NgForm } from '@angular/forms';
import { ApiAuthService } from '../services/api-auth.service';
import { Subscription } from 'rxjs';

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
  isSignalrMode: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public signalrService: SignalrService,
    public authService: AuthService,
    private apiAuthService: ApiAuthService,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.signalrService.isSignalrModeSubject$.subscribe(isSignalr => {
      this.isSignalrMode = isSignalr;
    }));
  }

  ngOnDestroy(): void {
    if (this.isSignalrMode) {
      this.signalrService.offConnection(['Authentification_ResponseSuccess', 'Authentification_Fail', 'Registration_Fail']);
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isRegisterMode) {
        this.authService.registration(form.value.email, form.value.password);
      }

      else {
        this.authService.authentification(form.value.email, form.value.password);
      }

      form.reset();
    }

    else return;
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  toggleSignalr() {
    this.signalrService.switchSignalrMode();

    if (this.isSignalrMode) {
      this.signalrService.startConnection().then(() => {
        // Ensure the connection is fully established before start authentificationProcess
        this.authService.authentificationProcess();
        this.authService.authentificationListenerSuccess();
        this.authService.authentificationListenerFail();
        this.authService.registrationListenerSuccess();
        this.authService.registrationListenerFail();
      }).catch(err => {
        console.error('Error starting SignalR connection:', err);
      });
    }

    else {
      this.signalrService.stopConnection();
    }
  }

  loginAPI(form: NgForm) {
    this.apiAuthService.login(form.value.email, form.value.password).subscribe({
      next: response => {
        localStorage.setItem('token', response.token);
        const userRole = this.apiAuthService.getUserRole();

        if (userRole === '1') {
          this.authService.router.navigate(['/display-connection-status']);
        }

        else {
          this.authService.router.navigate(['/edit-products']);
        }
      },

      error: err => this.errorMessage = 'Login failed. Please check your credentials.'
    });
  }

  registerAPI(form: NgForm) {
    this.apiAuthService.register(form.value.email, form.value.password).subscribe({
      next: response => {
        localStorage.setItem('token', response.token);
        this.authService.router.navigate(['/display-products']);
      },

      error: err => this.errorMessage = 'Registration failed. Please try again.'
    });
  }
}
