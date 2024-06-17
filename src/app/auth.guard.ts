import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const expectedRoles = route.data['expectedRoles'];
      const userRole = this.authService.getCurrentUserRole();
      if (expectedRoles.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['/publication']);
        return false;
      }
    } else {
      this.router.navigate(['/publication']);
      return false;
    }
  }
}
