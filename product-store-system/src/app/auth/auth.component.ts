import { Component } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { AuthService } from '../services/auth.service';
import { GeneralModule } from '../modules/general.module';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  isRegisterMode: boolean = false;

  constructor(
    private signalrService: SignalrService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('#3 AuthComp_ngOnInit After Wait connection to start');
    this.authService.authorizeListenerSuccess();
    this.authService.authorizeListenerFail();
  }

  ngOnDestroy(): void {
    this.signalrService.offConnection('Authentification_ResponseSuccess');
    this.signalrService.offConnection('Authentification_Fail');
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.authentification(form.value.email, form.value.password);
      form.reset();
    } else return;
  }
}
