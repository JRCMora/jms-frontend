import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isReviewer: boolean = false;
  isAuthor: boolean = false;
  isDashboardActive = false;
  isUserManagementActive = false;
  isReviewerManagementActive = false;
  isJournalManagementActive = false;
  isRubricManagementActive = false;
  isReviewerDashboardActive = false;
  isReviewerAssignedJournalActive = false;
  isResearcherDashboardActive = false;
  isResearcherManuscriptStatus = false;

  constructor(private authService: AuthService, 
              private router: Router, private http: HttpClient ) {
                this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check current route and set boolean variables accordingly
        this.isDashboardActive = event.url === '/admin/dashboard';
        this.isUserManagementActive = event.url === '/admin/user-management';
        this.isReviewerManagementActive = event.url === '/admin/reviewer-management';
        this.isJournalManagementActive = event.url.startsWith('/admin/journal-management');
        this.isRubricManagementActive = event.url === '/admin/rubric-management';
        this.isReviewerDashboardActive = event.url === '/reviewer/dashboard';
        this.isReviewerAssignedJournalActive = event.url === '/reviewer/assigned-journals';
        this.isResearcherDashboardActive = event.url === '/researcher/dashboard';
        this.isResearcherManuscriptStatus = event.url === '/researcher/journal-status';
      });
              }

  ngOnInit(): void {
   // Retrieve user role from session storage
                const userRole = sessionStorage.getItem('userRole');
                // Check if the user is an admin or superadmin
                this.isAdmin = userRole === 'admin';
                this.isSuperAdmin = userRole === 'superadmin';
                this.isAuthor = userRole === 'author';
                this.isReviewer = userRole === 'reviewer';
                const userId = sessionStorage.getItem('userId');
                if (userId) {
                  this.http.get<any[]>(`https://jms-backend-testing.vercel.app/notifications/${userId}`).subscribe(
                    (data) => {
                        this.notifications = data; // Store all notifications
                        this.unreadNotifications = data.filter(notification => notification.status === 'unread'); // Filter unread notifications
                    },
                    (error) => {
                        console.error(error);
                        // Hadle error
                    }
                  );
                }
                
              }

              
              toggleDropdown(){
                this.isDropdownOpen = !this.isDropdownOpen;
                this.showNotifDropdown = false;
              }
            
              toggleNotifDropdown(){
                this.showNotifDropdown = !this.showNotifDropdown;
                this.isDropdownOpen = false;
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

  viewSubmittedJournal(journalId: string) {
    // Navigate to the journal management component with the page parameter set to the last page
    this.router.navigate(['/admin/journal-management'], { queryParams: { page: 'last' } });
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

  logout() {
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigate(['publication'])
  } 
}