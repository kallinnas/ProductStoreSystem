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

  startConnection = (loginToken: string): Promise<void> => {   
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubURL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => loginToken,
      })
      .withAutomaticReconnect()
      .build();

    return this.hubConnection.start()
      .then(() => {
        console.log('Hub connection started!');
        this.signalrSubject.next({ type: 'HubConnectionStarted' });
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        throw err;
      });
  }

  stopConnection = () => {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.stop()
        .then(() => {
          console.log('Hub connection stopped!');
          this.signalrSubject.next({ type: 'HubConnectionStopped' });
        })
        .catch(err => console.log('Error while stopping connection: ' + err));
    }
  }

  offConnection(text: string | string[]) {
    (Array.isArray(text) ? text : [text]).forEach(t => this.hubConnection.off(t));
  }

}
