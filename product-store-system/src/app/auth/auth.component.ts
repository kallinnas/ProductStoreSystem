import { Component } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { AuthService } from '../services/auth.service';
import { GeneralModule } from '../modules/general.module';
import { NgForm } from '@angular/forms';
import { ApiAuthService } from '../services/api-auth.service';
import { Subscription, take } from 'rxjs';
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
    // if (this.isSignalrMode) {
    //   this.signalrService.offConnection(['Authentification_ResponseSuccess', 'Authentification_Fail', 'Registration_Fail']);
    // }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isRegisterMode) {
        const user = new UserRegistrDto(form.value.email, form.value.password, form.value.name);
        this.authService.registration(user);
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

  // toggleSignalr() {
  //   try {
  //     this.signalrService.switchSignalrMode();

  //     if (this.signalrService.hubConnection.state == HubConnectionState.Connected) {
  //       this.subscriptions.push(
  //         this.signalrService.isSignalrModeSubject$.pipe(take(1)).subscribe(isSignalr => {
  //           // Update the local state
  //           this.isSignalrMode = isSignalr;

  //           // Perform actions based on the new mode
  //           if (this.isSignalrMode) {
  //             // Ensure the connection is fully established before starting the authentication process
  //             const loginToken = localStorage.getItem('token');
  //             this.authService.launchHub(loginToken ? loginToken : '');
  //           } else {
  //             this.signalrService.stopConnection();
  //           }
  //         }));
  //     }
  //   }

  //   catch (err) {
  //     console.log(err);
  //   }

  //   // if (this.isSignalrMode) {
  //   //   // Ensure the connection is fully established before start authentificationProcess
  //   //   const loginToken = localStorage.getItem('token')
  //   //   this.authService.launchHub(loginToken ? loginToken : '');
  //   // }

  //   // else {
  //   //   this.signalrService.stopConnection();
  //   // }
  // }

  loginAPI(form: NgForm) {
    this.apiAuthService.login(form.value.email, form.value.password).subscribe({
      next: response => {
        // this.signalrService.switchSignalrMode();
        this.authorizeUser(response.token);
      },

      error: err => this.errorMessage = 'Login failed. Please check your credentials.'
    });
  }

  registerAPI(form: NgForm) {
    const user = new UserRegistrDto(form.value.email, form.value.password, form.value.name);

    this.apiAuthService.register(user).subscribe({
      next: response => {
        this.authorizeUser(response.token);
      },

      error: err => this.errorMessage = 'Registration failed. Please try again.'
    });
  }

  private authorizeUser(token: string) {
    this.authService.launchHub(token)
    localStorage.setItem('token', token);
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
