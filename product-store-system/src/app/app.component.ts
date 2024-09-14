import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { GeneralModule } from './modules/general.module';
import { AuthService } from './services/auth.service';
import { filter, Subscription } from 'rxjs';
import { ApiAuthService } from './services/api-auth.service';
import { SignalrService } from './services/signalr.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isAuthorized: boolean = false;
  isAuthPage: boolean = false;

  constructor(
    public authService: AuthService,
    public apiAuthService: ApiAuthService,
    public signalrService: SignalrService,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.apiAuthService.checkAuthentication();

      this.subscriptions.push(
        this.apiAuthService.isAuthenticatedSubject$.subscribe(valid => {
          this.isAuthorized = valid;
          if (valid) {
            const token = localStorage.getItem('token');
            // && this.signalrService.hubConnection.state === signalR.HubConnectionState.Connected
            if (!this.signalrService.hubConnection) {
              this.authService.launchHub(token!);
            }
          }
        }));
    }

    this.authService.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const authRoutes = ['/auth'];
        this.isAuthPage = authRoutes.includes(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
