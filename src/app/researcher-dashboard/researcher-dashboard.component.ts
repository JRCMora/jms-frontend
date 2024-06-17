import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-researcher-dashboard',
  templateUrl: './researcher-dashboard.component.html',
  styleUrls: ['./researcher-dashboard.component.css']
})
export class ResearcherDashboardComponent {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  totalSubmittedJournals: number = 0; // Variable to store the total submitted journals
  totalPublishedJournals: number = 0;
  totalRevisionJournals: number = 0;
  totalRejectedJournals: number = 0;
  journalStatusData: any[] = [];
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28']
  };

  constructor(private authService: AuthService, 
              private router: Router, 
              private http: HttpClient,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchTotalSubmittedJournals();
    this.fetchJournalStatusData();
  }

  fetchTotalSubmittedJournals() {
    const userId = sessionStorage.getItem('userId'); // Get the user ID from session storage
    if (userId) {
      // Make an HTTP GET request to fetch the user's submitted journals
      this.http.get<any[]>(`https://jms-backend-testing.vercel.app/user/${userId}/journals`).subscribe(
        (data) => {
          this.totalSubmittedJournals = data.length;
          this.totalPublishedJournals = data.filter(journal => journal.status === 'Published' || journal.status === 'Accepted').length;
          this.totalRevisionJournals = data.filter(journal => journal.status === 'Needs Revision').length;
          this.totalRejectedJournals = data.filter(journal => journal.status === 'Rejected').length;
        },
        (error) => {
          console.error(error);
          // Handle error
        }
      );
    }
  }

  fetchJournalStatusData() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.http.get<any[]>(`https://jms-backend-testing.vercel.app/user/${userId}/journals`).subscribe(
        (data) => {
          // Filter the journals to include only "Under Review" and "Reviewed" statuses
          const filteredJournals = data.filter(journal => journal.status === 'Under Review' || journal.status === 'Reviewed' || journal.status === 'Under Review (Revision)' || journal.status === 'Published' || 
          journal.status === 'Rejected' || journal.status === 'Accepted' || journal.status === 'Needs Revision' || journal.status === 'Pending');
  
          // Calculate the count for each status
          const needRevisionCount = filteredJournals.filter(journal => journal.status === 'Needs Revision').length ;
          const publishedCount = filteredJournals.filter(journal => journal.status === 'Published' || journal.status === 'Accepted').length ;
          const rejectedCount = filteredJournals.filter(journal => journal.status === 'Rejected').length ;
          const count = filteredJournals.length - needRevisionCount - publishedCount - rejectedCount;
  
          // Construct the data array for the pie chart
          this.journalStatusData = [
            { name: 'Needs Revision', value: needRevisionCount },
            { name: 'Published', value: publishedCount },
            { name: 'Rejected', value: rejectedCount }
          ];
          
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
