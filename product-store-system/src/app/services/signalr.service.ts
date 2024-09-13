import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserSignalrDto } from '../models/user.model';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalrService {

  hubConnection!: signalR.HubConnection;
  userData!: UserSignalrDto;
  private signalrSubject = new Subject<any>();
  signalrSubject$ = this.signalrSubject.asObservable();

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubURL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
        // , accessTokenFactory: () => localStorage.getItem('token')
      })
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('#0 Hub conn started!');
        this.signalrSubject.next({ type: 'HubConnectionStarted' });
      })
      .catch(err => console.log('Error while srating conn: ' + err));
  }

  offConnection(text: string) { this.hubConnection.off(text); }
}
