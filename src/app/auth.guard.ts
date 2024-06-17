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
      // User is authenticated
      const expectedRoles = route.data['expectedRoles'];
      const userRole = this.authService.getCurrentUserRole();
      if (expectedRoles.includes(userRole)) {
        // User has the required role, allow access
        return true;
      } else {
        // User does not have the required role, redirect to unauthorized page or home page
        this.router.navigate(['/publication']);
        return false;
      }
    } else {
      // User is not authenticated, redirect to publication page
      this.router.navigate(['/publication']);
      return false;
    }
  }
}
