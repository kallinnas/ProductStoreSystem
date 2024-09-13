import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SignalrService } from './signalr.service';
import { Router } from '@angular/router';
import { HubConnectionState } from '@microsoft/signalr';
import { UserSignalrDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthentificated: boolean = false;

  private baseUrl: string = `${environment.baseURL}/Auth`;

  constructor(
    private signalrService: SignalrService,
    public router: Router
  ) {
    // this.authentificationProcess();
  }

  authentificationProcess() {
    const id = localStorage.getItem('token');

    if (id) {
      if (this.signalrService.hubConnection.state === HubConnectionState.Connected) {
        this.reAuthentificationListenerSuccess();
        this.reAuthentification(id);
      }

      else {
        console.log('#2 constructor Wait connection to start');
        this.signalrService.signalrSubject$.subscribe(response => {
          if (response.type == "HubConnectionStarted") {
            this.reAuthentificationListenerSuccess();
            this.reAuthentification(id);
          }
        });
      }
    }
  }

  async authentification(email: string, password: string) {
    const userDto = { email: email, password: password };

    await this.signalrService.hubConnection.invoke('Authentification', userDto)
      .then(() => {
        alert("Loading is attempt...")
      })
      .catch(err => console.log(err));
  }

  authentificationListenerSuccess() {
    this.signalrService.hubConnection.on('Authentification_ResponseSuccess', (user: UserSignalrDto) => {
      this.signalrService.userData = { ...user };
      localStorage.setItem('token', user.id.toString());

      this.isAuthentificated = true;
      alert('Loggeed-in successfully!');
      this.router.navigate(["/edit-products"]);
    });
  }

  async reAuthentification(userId: string) {
    await this.signalrService.hubConnection.invoke('ReAuthentification', userId)
      .then(() => {
        alert("Loading is attempt...");
      })
      .catch(err => console.log(err));
  }

  reAuthentificationListenerSuccess() {
    this.signalrService.hubConnection.on('ReAuthentification_ResponseSuccess', (user: UserSignalrDto) => {

      this.signalrService.userData = { ...user };
      this.isAuthentificated = true;
      alert('Re-authentificated!');

      if (this.router.url == "/auth")
        this.router.navigate(["/edit-products"]);
    });
  }

  async registration(email: string, password: string) {
    const userDto = { email: email, password: password };

    await this.signalrService.hubConnection.invoke('Registration', userDto)
      .then(() => {
        alert("Loading is attempt...")
      })
      .catch(err => console.log(err));
  }

  registrationListenerSuccess() {
    this.signalrService.hubConnection.on('Registration_ResponseSuccess', (user: UserSignalrDto) => {
      this.signalrService.userData = { ...user };
      localStorage.setItem('token', user.id.toString());

      this.isAuthentificated = true;
      alert('Registrated successfully!');
      this.router.navigate(["/edit-products"]);
    });
  }

  authentificationListenerFail() {
    this.signalrService.hubConnection.on("Authentification_Fail", () => alert("Wrong credentials!"));
  }

  registrationListenerFail() {
    this.signalrService.hubConnection.on("Registration_Fail", () => alert("Such email already taken."));
  }

}
