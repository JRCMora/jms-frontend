import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JournalService } from '../journal.service';
import { HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  isLoggedIn: boolean = false;
  publishedJournals: any[] = [];
  filteredJournals: any[] = [];
  searchQuery: string = '';
  userRole: string = '';
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private router: Router, 
              private journalService: JournalService,
              private authService: AuthService,
              private http: HttpClient
              ) { }

  ngOnInit(): void {
    this.currentPage = 1;
    
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    this.userRole = sessionStorage.getItem('userRole') || '';

    this.isLoggedIn = isLoggedIn === 'true'; // Convert string to boolean
    this.fetchPublishedJournals();
  }

  fetchPublishedJournals() {
    this.journalService.getJournals().subscribe(
      (data) => {
        // Filter journals with "Published" status
        this.publishedJournals = data.filter(journal => journal.status === 'Published');
      },
      (error) => {
        console.error(error);
        // Handle error
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

  viewJournal(journalId: string) {
    this.router.navigate(['/publication-view-journal', journalId]);
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
    const visiblePages = Math.min(totalPages, 3); // Maximum 5 pages shown
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

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showNotifDropdown = false;
  }

  toggleNotifDropdown(){
    this.showNotifDropdown = !this.showNotifDropdown;
    this.isDropdownOpen = false;
  }

  getDashboardLink(): string {
    if (this.userRole === 'author') {
      return `/researcher/dashboard`;
    } else if (this.userRole === 'superadmin')
    {
      return `/admin/dashboard`;
    }
    else {
      return `/${this.userRole}/dashboard`;
    }
  }

  logout() {
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/publication']);
    });
  } 
}