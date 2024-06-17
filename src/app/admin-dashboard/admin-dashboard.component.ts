  import { Component,HostListener } from '@angular/core';
  import { Router } from '@angular/router';
  import { AuthService } from '../auth.service';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { UserService } from '../user.service';
  import { JournalService } from '../journal.service';
  import { LegendPosition } from '@swimlane/ngx-charts';
  import { HttpClient } from '@angular/common/http';



  @Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
  })
  export class AdminDashboardComponent {
    isAdmin: boolean = false;
    isSuperAdmin: boolean = false;
    unreadNotifications: any[] = [];
    showNotifDropdown: boolean = false;
    isDropdownOpen = false;
    journalStatusData: any[] = [];
    colorScheme: any = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    legendPosition: LegendPosition = LegendPosition.Below; // Use LegendPosition type
    gradient: boolean = true;
    totalUsers: number = 0;
    totalRubrics: number = 0;
    totalJournals: number = 0;

    constructor(private authService: AuthService, 
                private router: Router, 
                private snackBar: MatSnackBar,
                private journalService: JournalService,
                private http: HttpClient) {}
    
    ngOnInit(): void {
      // Retrieve user role from session storage
      const userRole = sessionStorage.getItem('userRole');
      // Check if the user is an admin or superadmin
      this.isAdmin = userRole === 'admin';
      this.isSuperAdmin = userRole === 'superadmin';

      this.fetchJournalStatistics();
      this.fetchTotalUsers();
      this.fetchTotalRubrics();
      this.fetchTotalJournals();
    }

    fetchTotalJournals(): void {
      this.http.get<any>('https://jms-backend-testing.vercel.app/total-journals').subscribe(
        (data) => {
          this.totalJournals = data.totalJournals;
        },
        (error) => {
          console.error(error);
          // Handle error
        }
      );
    }

    fetchTotalRubrics(): void {
      this.http.get<any>('https://jms-backend-testing.vercel.app/total-rubrics').subscribe(
        (data) => {
          this.totalRubrics = data.totalRubrics;
        },
        (error) => {
          console.error(error);
          // Handle error
        }
      );
    }

    fetchTotalUsers(): void {
      this.http.get<any>('https://jms-backend-testing.vercel.app/total-users').subscribe(
        (data) => {
          this.totalUsers = data.totalUsers;
        },
        (error) => {
          console.error(error);
          // Handle error
        }
      );
    }

    fetchJournalStatistics() {
      this.journalService.getJournalStatusStatistics().subscribe(
        (data: any[]) => {
          // Calculate percentages and format data
          const totalCount = data.reduce((acc, cur) => acc + cur.value, 0);
          this.journalStatusData = data.map(item => ({
            name: item.name === 'Under Review (Revision)' ? 'Under Review' : item.name, // Merge the status category
            value: item.value
          }));
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
