import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { ApiAuthService } from "../services/api-auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private apiAuthService: ApiAuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (!token) {
        this.router.navigate(['auth']);
        return false;
      }

      const userRole = this.apiAuthService.getUserRole();

      if (!userRole) {
        this.router.navigate(['auth']);
        return false;
      }

      if (route.routeConfig?.path === 'display-connection-status' || route.routeConfig?.path === 'edit-products') {
        if (userRole === '1') { // admin
          return true;
        } 
        
        else {
          this.router.navigate(['display-products']);
          return false;
        }
      }
    } 
    
    else {
      this.router.navigate(['auth']);
      return false;
    }

    return true;
  }
}
