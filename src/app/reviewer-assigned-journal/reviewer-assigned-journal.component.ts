import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { JournalService } from '../journal.service';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reviewer-assigned-journal',
  templateUrl: './reviewer-assigned-journal.component.html',
  styleUrls: ['./reviewer-assigned-journal.component.css']
})
export class ReviewerAssignedJournalComponent {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  journals: any[] = [];
  filteredJournals: any[] = [];
  searchQuery: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  sortDirection: string = 'asc'; // Default sorting direction
sortColumn: string = ''; // Default sorting column



  constructor(private authService: AuthService,
              private router: Router, 
              private journalService: JournalService, 
              private userService: UserService, 
              private http: HttpClient,
              private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    // Get the user ID from localStorage
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      // Fetch assigned journals for the current reviewer
      this.journalService.getAssignedJournals(userId).subscribe(
        (data) => {
          this.journals = data.map((journal, index) => ({ ...journal, id: index + 1 }));
          this.filteredJournals = [...this.journals];
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
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  filterJournals() {
    if (!this.searchQuery.trim()) {
      this.currentPage = 1; 
      this.filteredJournals = [...this.journals];
    } else {
      const searchTerm = this.searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
      this.filteredJournals = this.journals.filter(journal => {
        return (
          journal.journalTitle.toLowerCase().includes(searchTerm) ||
          journal.status.toLowerCase().includes(searchTerm)
        );
      });
      this.currentPage = 1; 
    }
  }

  sortJournals(column: string) {
    // If the same column is clicked, toggle the sorting direction
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If a different column is clicked, reset the sorting direction to ascending
      this.sortDirection = 'asc';
      this.sortColumn = column;
    }
  
    // Sort the journals based on the selected column and direction
    this.filteredJournals.sort((a, b) => {
      const valA = typeof a[column] === 'string' ? a[column].toLowerCase() : a[column];
      const valB = typeof b[column] === 'string' ? b[column].toLowerCase() : b[column];
  
      if (valA < valB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
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

  viewJournal(journalId: string) {
    this.router.navigate(['/reviewer/view-journal', journalId]);
  }

  isFeedbackSubmitted(journal: any): boolean {
    // Check if the journal has review comments and if any of them belong to the current reviewer
    return journal.reviewComments && journal.reviewComments.some((comment: any) => comment.reviewer === sessionStorage.getItem('userId'));
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
  
  

  // Calculate the index of the first item displayed on the current page
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  // Calculate the index of the last item displayed on the current page
  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.filteredJournals.length - 1);
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredJournals.length / this.itemsPerPage);
    const visiblePages = Math.min(totalPages, 5); // Maximum 5 pages shown
    const startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);
  
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  logout() {
    this.snackBar.open('Logout successful.', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigate(['publication'])
  } 
  
}
