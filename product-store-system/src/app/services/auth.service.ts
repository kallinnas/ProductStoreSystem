import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';
import { Router } from '@angular/router';
import { HubConnectionState } from '@microsoft/signalr';
import { UserRegistrDto, UserSignalrDto } from '../models/user.model';
import * as signalR from '@microsoft/signalr';
import { ApiAuthService } from './api-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private signalrService: SignalrService,
    private apiAuthService: ApiAuthService,
    public router: Router
  ) { }

  authentificationProcess() {
    if (this.signalrService.hubConnection) {
      if (this.signalrService.hubConnection.state === HubConnectionState.Connected) {
        this.reAuthentificationListenerSuccess();
        this.reAuthentification();
      }

      else {
        this.signalrService.signalrSubject$.subscribe(response => {
          if (response.type == "HubConnectionStarted") {
            this.reAuthentificationListenerSuccess();
            this.reAuthentification();
          }
        });
      }
    }
  }

  launchHub(token: string) {
    this.signalrService.startConnection(token).then(() => {
      this.authentificationProcess();
      this.authentificationListenerSuccess();
      this.authentificationListenerFail();
      this.registrationListenerSuccess();
      this.registrationListenerFail();
      this.signalrService.offConnection(['Authentification_ResponseSuccess', 'Authentification_Fail', 'Registration_Fail', "ngOnDestroy in app"]);
    }).catch(err => {
      console.error('Error starting SignalR connection:', err);
    });
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
    if (this.signalrService.hubConnection && this.signalrService.hubConnection.state === signalR.HubConnectionState.Connected) {
      // Ensure hub state connection before adding the listener
      this.signalrService.hubConnection.on('Authentification_ResponseSuccess', (user: UserSignalrDto) => {
        this.signalrService.userData = { ...user };
        localStorage.setItem('token', user.id.toString());

        alert('Logged-in successfully!');
        this.router.navigate(["/edit-products"]);
      });
    } else {
      console.error('Hub connection is not in a connected state.');
    }
  }

  async reAuthentification() {
    try {
      const userId = this.apiAuthService.getUserId();
      await this.signalrService.hubConnection.invoke('ReAuthentification', userId)
        .then(() => {
          alert("Loading is attempt...");
        })
        .catch(err => console.log(err));
    }

    catch (err) {
      console.log(err);
    }
  }

  reAuthentificationListenerSuccess() {
    try {
      if (this.signalrService.hubConnection && this.signalrService.hubConnection.state === signalR.HubConnectionState.Connected) {
        this.signalrService.hubConnection.on('ReAuthentification_ResponseSuccess', (user: UserSignalrDto) => {

          this.signalrService.userData = { ...user };
          alert('Re-authentificated!');

          if (this.router.url == "/auth")
            this.router.navigate(["/edit-products"]);
        });
      }

      else {
        console.error('Hub connection is not in a connected state.');
      }
    }

    catch (err) {
      console.log(err);
    }
  }

  async registration(user: UserRegistrDto) {
    await this.signalrService.hubConnection.invoke('Registration', user)
      .then(() => {
        alert("Loading is attempt...")
      })
      .catch(err => console.log(err));
  }

  registrationListenerSuccess() {
    if (this.signalrService.hubConnection && this.signalrService.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.signalrService.hubConnection.on('Registration_ResponseSuccess', (user: UserSignalrDto) => {
        this.signalrService.userData = { ...user };
        localStorage.setItem('token', user.id.toString());

        alert('Registrated successfully!');
        this.router.navigate(["/edit-products"]);
      });
    } else {
      console.error('Hub connection is not in a connected state.');
    }
  }

  authentificationListenerFail() {
    this.signalrService.hubConnection.on("Authentification_Fail", () => alert("Wrong credentials!"));
  }

  registrationListenerFail() {
    this.signalrService.hubConnection.on("Registration_Fail", () => alert("Such email already taken."));
  }

}
