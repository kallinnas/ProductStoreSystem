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
    this.authentificationProcess();
  }

  authentificationProcess() {
    const id = localStorage.getItem('token');

    if (id) {
      console.log('#1 constructor Has token');

      if (this.signalrService.hubConnection.state === HubConnectionState.Connected) {
        console.log('#2 constructor Connection exists');
        this.reAuthorizeListener();
        this.reAuthorize(id);
      }

      else {
        console.log('#2 constructor Wait connection to start');
        this.signalrService.signalrSubject$.subscribe(response => {
          if (response.type == "HubConnectionStarted") {
            this.reAuthorizeListener();
            this.reAuthorize(id);
          }
        });
      }
    }
  }

  async authentification(email: string, password: string) {
    console.log('#1 authMe First authorization');
    const userDto = { email: email, password: password };

    await this.signalrService.hubConnection.invoke('Authentification', userDto)
      .then(() => {
        console.log('#3 authMe After Listener');
        alert("Loading is attempt...")
      })
      .catch(err => console.log(err));
  }

  authorizeListenerSuccess() {
    console.log('#4 authorizeListenerSuccess')

    this.signalrService.hubConnection.on('Authentification_ResponseSuccess', (user: UserSignalrDto) => {
      const step = localStorage.getItem('token') ? 8 : 2;
      console.log(`#${step} authorizeListenerSuccess => setLocalStorage`);

      this.signalrService.userData = { ...user };
      localStorage.setItem('token', user.id.toString());

      this.isAuthentificated = true;
      alert('Login successfully!');
      this.router.navigate(["/edit-products"]);
    });
  }

  authorizeListenerFail() {
    console.log('#5 authorizeListenerFail');
    this.signalrService.hubConnection.on("Authentification_Fail", () => alert("Wrong credentials!"));
  }

  async reAuthorize(userId: string) {
    console.log('#7 reAuth');
    await this.signalrService.hubConnection.invoke('ReAuthentification', userId)
      .then(() => {
        console.log('#10 reAuth then()');
        alert("Loading is attempt...");
      })
      .catch(err => console.log(err));
  }

  reAuthorizeListener() {
    console.log('#6 reAuthListener');
    this.signalrService.hubConnection.on('ReAuthentification_ResponseSuccess', (user: UserSignalrDto) => {
      console.log('#9 reAuthListener => response');

      this.signalrService.userData = { ...user };
      this.isAuthentificated = true;
      alert('Re-authentificated!');

      if (this.router.url == "/auth")
        this.router.navigate(["/edit-products"]);
    });
  }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, { email, password });
  // }

  // register(email: string, password: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/register`, { email, password });
  // }

  // logout(): void {
  //   localStorage.removeItem('token');
  // }

  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  // isAuthenticated(): boolean {
  //   return !!this.getToken();
  // }

  // getUserRole(): string | null {
  //   const token = this.getToken();
  //   if (!token) return null;

  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return payload['role']; // Assuming the JWT contains a 'role' claim
  // }
}
