import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { JournalService } from '../journal.service';
import { HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-researcher-view-journal',
  templateUrl: './researcher-view-journal.component.html',
  styleUrls: ['./researcher-view-journal.component.css']
})
export class ResearcherViewJournalComponent implements OnInit{
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  journalId: string = '';
  journalTitle: string = '';
  consolidatedFeedback: string = '';
  selectedFile: File | null = null;
  status: string = ''; // Add status property

  constructor (private router: Router, 
              private authService: AuthService, 
              private route: ActivatedRoute, 
              private journalService: JournalService,
              private http: HttpClient,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.journalId = params.get('journalId') || '';
      if (this.journalId) {
        this.getConsolidatedFeedback();
        this.getJournalStatus();
      }
    });
  }

  getConsolidatedFeedback(): void {
    this.journalService.getConsolidatedFeedback(this.journalId)
      .subscribe(
        (data) => {
          // Assuming the response contains consolidated feedback
          this.consolidatedFeedback = data.consolidatedFeedback;
          this.journalTitle = data.journalTitle;
        },
        (error) => {
          console.error(error);
          // Handle error scenario
        }
      );
  }

  getJournalStatus(): void {
    this.journalService.getJournalById(this.journalId)
      .subscribe(
        (data) => {
          this.status = data.status; // Assuming the API response contains the status of the journal
        },
        (error) => {
          console.error(error);
          // Handle error scenario
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitRevisedJournal(): void {
    if (!this.selectedFile) {
      // Handle case where no file is selected for submission
      return;
    }
    const formData = new FormData();
    formData.append('journalFile', this.selectedFile, this.selectedFile.name);
    formData.append('journalId', this.journalId); // Include the journalId in the form data
    formData.append('journalTitle', this.journalTitle); // Include the journalTitle in the form data
  
    this.http.post<any>('https://jms-backend-testing.vercel.app/journals', formData)
      .subscribe(
        (response) => {
          // Handle success scenario
          this.snackBar.open('Revised journal submitted successfully.', 'Close', { duration: 3000, verticalPosition: 'top'});
          console.log(response);
  
          // Update the journal status to "Under Review (Revision)"
          this.updateJournalStatus();
  
          // Redirect or perform any other action as needed
        },
        (error) => {
          console.error(error);
          // Handle error scenario
          this.snackBar.open('Failed to submit revised journal.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: ['error-snackbar']});
        }
      );
  }
  
  updateJournalStatus(): void {
    const updatedStatus = 'Under Review (Revision)';
    // Assuming you have a service method to update the journal status
    this.journalService.updateJournalStatus(this.journalId, updatedStatus)
      .subscribe(
        () => {
          // Update the status property locally
          this.status = updatedStatus;
        },
        (error) => {
          console.error(error);
          // Handle error scenario
        }
      );
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
    }
  }
  
  viewJournal(journalId: string): void {
    this.router.navigate(['/researcher/view-journal', journalId]);
  }

  logout() {
    this.snackBar.open('Logout successful.', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigate(['publication'])
  } 

  toggleNotifDropdown(){
    this.showNotifDropdown = !this.showNotifDropdown;
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
