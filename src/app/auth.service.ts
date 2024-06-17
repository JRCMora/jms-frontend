import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://jms-backend-testing.vercel.app'; // Update with your backend URL
  private isUserLogged =  new BehaviorSubject<boolean>(false);
  private isUserLogged$ =  this.isUserLogged.asObservable();
  private currentUserRole: string = ''; // Add currentUserRole property
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }
  setIsUserLogged(status:boolean):void {
    this.isUserLogged.next(status);
    sessionStorage.setItem('isLoggedIn', status ? 'true' : 'false');
  }

  getUserIsLogged():Observable<boolean>{
    return this.isUserLogged$
  }
  isUserRemembered(): boolean {
    return localStorage.getItem('rememberMe') === 'true';
  }
  clearUserId(): void {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
  }

  isUserAdmin(): boolean {
    return this.currentUserRole === 'admin'; // Adjust this based on your implementation
  }

  setIsAuthenticated(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  isAuthenticated(): boolean {
    // Check authentication status from session storage or local storage
    return sessionStorage.getItem('userId') !== null;
  }

  getCurrentUserRole(): string {
    // Get user role from session storage or local storage
    return sessionStorage.getItem('userRole') || '';
  }

  // Method to set the current user's role
  setCurrentUserRole(role: string): void {
    this.currentUserRole = role;
  }

}
