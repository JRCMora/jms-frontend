import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reviewer-dashboard',
  templateUrl: './reviewer-dashboard.component.html',
  styleUrls: ['./reviewer-dashboard.component.css']
})
export class ReviewerDashboardComponent implements OnInit {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  totalAssignedJournals: number = 0; // Variable to store total assigned journals
  totalAssignedUnderReview: number = 0; // Variable to store total assigned journals under review
  totalAssignedReviewed: number = 0;
  journalStatusData: any[] = [];
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28']
  };


  constructor(private authService: AuthService, 
              private router: Router, 
              private http: HttpClient,
              private snackBar: MatSnackBar) {}

  
  ngOnInit(): void {
    // Fetch unread notifications for the current user
    this.fetchTotalAssignedJournals();
    this.fetchJournalStatusData();

}

fetchJournalStatusData() {
  const userId = sessionStorage.getItem('userId');
  if (userId) {
    this.http.get<any[]>(`https://jms-backend-testing.vercel.app/user/reviewers/${userId}/assigned-journals`).subscribe(
      (data) => {
        // Filter the journals to include only "Under Review" and "Reviewed" statuses
        const filteredJournals = data.filter(journal => journal.status === 'Under Review' || journal.status === 'Reviewed' || journal.status === 'Under Review (Revision)' || journal.status === 'Published' || 
        journal.status === 'Rejected' || journal.status === 'Accepted' || journal.status === 'Needs Revision');

        // Calculate the count for each status
        const underReviewCount = filteredJournals.filter(journal => journal.status === 'Under Review' || journal.status === 'Under Review (Revision)').length;
        const reviewedCount = filteredJournals.filter(journal => journal.status === 'Reviewed' || journal.status === 'Published' || 
        journal.status === 'Rejected' || journal.status === 'Accepted' || journal.status === 'Needs Revision').length;

        // Construct the data array for the pie chart
        this.journalStatusData = [
          { name: 'Under Review', value: underReviewCount },
          { name: 'Reviewed', value: reviewedCount }
        ];
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
}


fetchTotalAssignedJournals() {
  const userId = sessionStorage.getItem('userId');
  if (userId) {
    this.http.get<any[]>(`https://jms-backend-testing.vercel.app/user/reviewers/${userId}/assigned-journals`).subscribe(
      (data) => {
        this.totalAssignedJournals = data.length;
        this.totalAssignedUnderReview = data.filter(journal => journal.status === 'Under Review' || journal.status === 'Under Review (Revision)').length;
        this.totalAssignedReviewed = data.filter(journal => journal.status === 'Reviewed' || journal.status === 'Published' || 
        journal.status === 'Rejected' || journal.status === 'Accepted' || journal.status === 'Needs Revision').length;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
}

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
      const notifDropdown = target.closest('.dropdown');
      if (!notifDropdown && this.showNotifDropdown) {
        this.showNotifDropdown = false;
      }
    }
  }

viewJournal(journalId: string) {
  this.router.navigate(['/reviewer/view-journal', journalId]);
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


  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showNotifDropdown = false;
  }

  toggleNotifDropdown(){
    this.showNotifDropdown = !this.showNotifDropdown;
    this.isDropdownOpen = false;
  }

  logout() {
    this.snackBar.open('Logout successful.', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigate(['publication'])
  } 
  
}
