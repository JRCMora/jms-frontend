import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService} from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  journalTitle: string = '';
  authors: string = '';
  abstract: string = '';
  keywords: string = '';
  selectedFile: File | null = null;

  constructor(private http: HttpClient, 
              private authService: AuthService, 
              private router: Router,
              private snackBar: MatSnackBar) {}

      @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check if the click is inside the dropdown toggle button
    if (target.matches('.dropdown-toggle')) {
      this.toggleDropdown(); // Toggle the dropdown
    } else {
      // Check if the click is outside the dropdown
      const dropdownContainer = target.closest('.dropdown');
      if (!dropdownContainer && this.isDropdownOpen) {
        this.isDropdownOpen = false;
      }
    }
  }            

  submitJournal() {
    const formData = new FormData();
    formData.append('journalTitle', this.journalTitle);
    formData.append('authors', this.authors);
    formData.append('abstract', this.abstract);
    formData.append('keywords', this.keywords);
    
    // Get userId from local storage
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }
  
    formData.append('userId', userId);
  
    if (this.selectedFile) {
      formData.append('journalFile', this.selectedFile, this.selectedFile.name);
    }
  
    this.http.post<any>('https://jms-backend-testing.vercel.app/journals', formData).subscribe(
      (response) => {
        this.snackBar.open('Manuscript submitted successfully.', 'Close', { duration: 3000, verticalPosition: 'top'});
        console.log(response.message);
        // Reset form fields after successful submission
        this.journalTitle = '';
        this.authors = '';
        this.abstract = '';
        this.keywords = '';
        this.selectedFile = null;
        this.sendAdminNotification();
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Submission failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Handle error
      }
    );
  }

  sendAdminNotification() {
    this.http.post<any>('https://jms-backend-testing.vercel.app/admin-notifications', {}).subscribe(
      (response) => {
        console.log('Admin notification sent:', response);
      },
      (error) => {
        console.error('Error sending admin notification:', error);
      }
    );
  }
  
  markNotificationAsRead(notification: any) {
    // Update the notification as read in the backend
    const notificationId = notification._id;
    this.http.put(`https://jms-backend-testing.vercel.app/notifications/${notificationId}/mark-as-read`, {}).subscribe(
        (response) => {
            console.log('Notification marked as read:', response);
            // Update the read status of the notification locally
            notification.Status = 'read';
            // Remove the notification from the unreadNotifications array
            this.unreadNotifications = this.unreadNotifications.filter(n => n._id !== notificationId);
        },
        (error) => {
            console.error('Error marking notification as read:', error);
        }
    );
  }

  viewJournal(journalId: string) {
    this.router.navigate(['/researcher/journal-status', journalId]);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

    logout() {
      this.snackBar.open('Logout successful.', 'Close', { duration: 3000, verticalPosition: 'top'});
      this.authService.setIsUserLogged(false);
      this.authService.clearUserId();
      this.router.navigate(['publication'])
    } 

    toggleDropdown(){
      this.isDropdownOpen = !this.isDropdownOpen;
      this.showNotifDropdown = false;
    }
  
    toggleNotifDropdown(){
      this.showNotifDropdown = !this.showNotifDropdown;
      this.isDropdownOpen = false;
    }
    
}
