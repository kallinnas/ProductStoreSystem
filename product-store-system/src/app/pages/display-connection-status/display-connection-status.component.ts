import { Component, OnInit } from '@angular/core';
import { UserSignalrDto } from '../../models/user.model';
import { SignalrService } from '../../services/signalr.service';
import { GeneralModule } from '../../modules/general.module';
import { HubConnectionState } from '@microsoft/signalr';
import { ApiAuthService } from '../../services/api-auth.service';

@Component({
  selector: 'app-display-connection-status',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './display-connection-status.component.html',
  styleUrl: './display-connection-status.component.scss'
})
export class DisplayConnectionStatusComponent implements OnInit {

  usersOnline = new Array<UserSignalrDto>();

  constructor(
    public signalrService: SignalrService,
    public apiAuthService: ApiAuthService,
  ) { }

  ngOnInit(): void {
    this.userOnline();
    this.userOffline();
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

  userOnline(): void {
    try {
      this.signalrService.hubConnection.on('User_Online', (user: UserSignalrDto) => {
        this.usersOnline.push(user);
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  userOffline(): void {
    try {
      this.signalrService.hubConnection.on('User_Offline', (userId: string) => {
        this.usersOnline = this.usersOnline.filter(u => u.id != userId);
      });
    }

    catch (err) {
      console.log(err);
    }
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
