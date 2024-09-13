import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GeneralModule } from './modules/general.module';
import { AuthService } from './services/auth.service';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'product-store-system';

  constructor(
    private signalrService: SignalrService
  ) { }

  ngOnInit(): void {
    this.signalrService.startConnection();
  }

  ngOnDestroy(): void {
    this.signalrService.offConnection("ngOnDestroy in app");
  }
}
