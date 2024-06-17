import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from '../journal.service';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RubricService } from '../rubric.service';

@Component({
  selector: 'app-reviewer-view-journal',
  templateUrl: './reviewer-view-journal.component.html',
  styleUrls: ['./reviewer-view-journal.component.css']
})

export class ReviewerViewJournalComponent implements OnInit {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  journalId: string | null = null;
  journal: any;
  error: string | null = null;
  rubric: any; 

  selectedChoice: string = ''; // Store the selected choice
  
  feedback: string = '';

  constructor(private authService: AuthService, 
              private router: Router, 
              private route: ActivatedRoute, 
              private journalService: JournalService, 
              private http: HttpClient, 
              private rubricService: RubricService, 
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.journalId = params.get('journalId');
      if (this.journalId) {
        this.getJournalDetails(this.journalId);
      } else {
        this.error = 'Journal ID not provided';
      }
    });
    // Fetch unread notifications for the current user
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.http.get<any[]>(`https://jms-backend-testing.vercel.app/notifications/${userId}`).subscribe(
        (data) => {
          this.unreadNotifications = data;
        },
        (error) => {
          console.error(error);
        }
      );
      // Fetch unread notifications for the current user
      this.http.get<any[]>(`https://jms-backend-testing.vercel.app/notifications/${userId}`).subscribe(
        (data) => {
            this.notifications = data; // Store all notifications
            this.unreadNotifications = data.filter(notification => notification.status === 'unread'); // Filter unread notifications
        },
        (error) => {
            console.error(error);
        }
      );
    }
  }

  getJournalDetails(journalId: string): void {
    this.journalService.getJournalById(journalId).subscribe(
      (data) => {
        this.journal = data;
      },
      (error) => {
        console.error(error);
        this.error = 'Error fetching journal details';
      }
    );
  }

  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // Check if the click is inside the dropdown toggle button
  if (target.matches('.dropdown-toggle')) {
    this.toggleDropdown();
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

  viewJournal(journalId: string) {
    this.router.navigate(['/reviewer/view-journal', journalId]);
  }
  

  submitFeedback() {
    // Check if a choice is selected
    if (!this.selectedChoice) {
      console.error('Please select a choice (approve, needs revisions, or reject)');
      return;
    }
  
    // Check if feedback is provided
    if (!this.feedback.trim()) {
      console.error('Please provide feedback');
      return;
    }
  
    // Check if userId is available
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    if (!this.journalId) {
      console.error('Journal ID not found');
      return;
    }
    
    // Call the service method to submit feedback
    this.journalService.submitFeedback(this.journalId, this.feedback, this.selectedChoice, userId)
      .subscribe(
        (response) => {
          console.log('Feedback submitted successfully:', response);
        },
        (error) => {
          console.error('Error submitting feedback:', error);
        }
      );
  }
  
  updateFeedback(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.feedback = target.value;
  }
  
  
  updateChoice(choice: string) {
    this.selectedChoice = choice;
  }

  openRubric() {
    if (this.journal && this.journal.rubricId) {
      const rubricId = this.journal.rubricId;
      window.open(`/view-rubric/${rubricId}`, '_blank'); // Open rubric in a new tab
    } else {
      console.log('Rubric not found for this journal.');
    }
  }

}
