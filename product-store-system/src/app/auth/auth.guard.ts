import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.authService.isAuthentificated) {
      this.authService.router.navigate(['auth']);
      return false;
    } return true;

    // const userRole = this.authService.getUserRole(); // Method to get role from token
    // if ('1' === '1') {
    //   return true;
    // }

    // this.router.navigate(['/']);
    // return false;
  }
}