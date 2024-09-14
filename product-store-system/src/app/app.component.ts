import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GeneralModule } from './modules/general.module';
import { AuthService } from './services/auth.service';
import { SignalrService } from './services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isSignalr: boolean = false;

  constructor(
    private signalrService: SignalrService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.signalrService.isSignalrModeSubject$.subscribe(isSignalr => { this.isSignalr = isSignalr; }));
  }

  ngOnDestroy(): void {
    if (this.isSignalr) {
      this.signalrService.offConnection("ngOnDestroy in app");
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
