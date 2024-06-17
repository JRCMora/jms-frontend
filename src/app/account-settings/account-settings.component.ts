import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent {
  user: any;
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (user: any) => {
          this.user = user;
        },
        (error: any) => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.snackBar.open('New password and confirm new password must match', 'Close', { duration: 3000, verticalPosition: 'top' });
      return;
    }

    const userId = sessionStorage.getItem('userId'); // Get the user's ID from sessionStorage
    if (!userId) {
      this.snackBar.open('User ID not found!', 'Close', { duration: 3000, verticalPosition: 'top' });
      console.error('User ID not found in sessionStorage');
      return;
    }
    
    // Call the changePassword method with the correct number of arguments
    this.userService.changePassword(userId, this.currentPassword, this.newPassword)
      .subscribe(
        () => {
          // Password change successful
          this.snackBar.open('Password changed successfully', 'Close', { duration: 3000, verticalPosition: 'top' });
          // Reset form fields
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        },
        error => {
          // Password change failed
          console.error('Password changed error:', error);
          this.snackBar.open('Failed to change password. Please try again later.', 'Close', { duration: 3000, verticalPosition: 'top' });
        }
      );
  }

}
