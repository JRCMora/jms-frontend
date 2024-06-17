import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jms-backend-testing.vercel.app'; // Update with your backend base URL

  constructor(private http: HttpClient) { }
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getRoles(role: string): Observable<any[]> {
    // Modify the URL to include the role parameter
    return this.http.get<any[]>(`${this.apiUrl}/users?role=${role}`);
  }
  // Method to fetch reviewer data for multiple reviewer IDs
  getReviewersByIds(reviewerIds: string[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/user/reviewers`, { reviewerIds });
  }
  getAssignedJournals(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/reviewers/${userId}/assigned-journals`);
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resend-verification-email`, { email });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  changePassword(userId: string, currentPassword: string, newPassword: string): Observable<any> {
    // Assuming your backend API endpoint for changing password is '/change-password'
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/change-password`, { currentPassword, newPassword });
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  // Define the resetPassword method
  resetPassword(resetToken: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password/${resetToken}`, { newPassword });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
  }
    // Method to update user information
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${user._id}`, user);
  }
  
}