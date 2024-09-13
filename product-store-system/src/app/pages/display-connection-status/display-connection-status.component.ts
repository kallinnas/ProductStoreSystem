import { Component, inject, OnInit } from '@angular/core';
import { UserSignalrDto } from '../../models/user.model';
import { SignalrService } from '../../services/signalr.service';
import { GeneralModule } from '../../modules/general.module';
import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-display-connection-status',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './display-connection-status.component.html',
  styleUrl: './display-connection-status.component.scss'
})
export class DisplayConnectionStatusComponent implements OnInit {

  usersOnline = new Array<UserSignalrDto>();

  signalrService = inject(SignalrService);

  ngOnInit(): void {
    this.userOnline();
    this.userOffline();
    this.logoutResponse();
    this.getOnlineUsers();

    if (this.signalrService.hubConnection.state == HubConnectionState.Connected) {
      this.getOnlineUsersInv();
    }

    else {
      this.signalrService.signalrSubject$.subscribe((response: any) => {
        if (response.type == "HubConnectionStarted") {
          this.getOnlineUsersInv();
        }
      });
    }
  }

  logout(): void {
    this.signalrService.hubConnection.invoke("LogoutUser", this.signalrService.userData.id)
      .catch(err => console.error(err));
  }

  logoutResponse(): void {
    this.signalrService.hubConnection.on('Logout_Response', () => {
      localStorage.removeItem('token');
      location.reload();
      // this.signalrService.hubConnection.stop();
    });
  }

  userOnline(): void {
    this.signalrService.hubConnection.on('User_Online', (person: UserSignalrDto) => {
      this.usersOnline.push(person);
    });
  }

  userOffline(): void {
    this.signalrService.hubConnection.on('User_Offline', (personId: string) => {
      this.usersOnline = this.usersOnline.filter(p => p.id != personId);
    });
  }

  getOnlineUsersInv(): void {
    this.signalrService.hubConnection.invoke('GetOnlineUsers')
      .catch(err => console.error(err));
  }

  getOnlineUsers(): void {
    this.signalrService.hubConnection.on('GetOnlineUsers_Response', (onlineUsers: Array<UserSignalrDto>) => {
      this.usersOnline = [...onlineUsers];
    });
  }
}
