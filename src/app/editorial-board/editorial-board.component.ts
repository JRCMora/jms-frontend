import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-editorial-board',
  templateUrl: './editorial-board.component.html',
  styleUrls: ['./editorial-board.component.css']
})
export class EditorialBoardComponent implements OnInit {
  notifications: any[] = [];
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  admins: any[] = [];
  reviewers: any[] = [];
  userRole: string = '';
  isLoggedIn: boolean = false;

  constructor(private userService: UserService,
              private router: Router, 
              private authService: AuthService,
              private http: HttpClient
  ) { }

  ngOnInit(): void {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    this.userRole = sessionStorage.getItem('userRole') || '';

    this.isLoggedIn = isLoggedIn === 'true'; 
    this.fetchAdmins();
    this.fetchReviewers();
  }

  getDashboardLink(): string {
    if (this.userRole === 'author') {
      return `/researcher/dashboard`;
    }
    else {
      return `/${this.userRole}/dashboard`;
    }
  }

  fetchAdmins(): void {
    this.userService.getRoles('admin').subscribe(
      (data) => {
        this.admins = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchReviewers(): void {
    this.userService.getRoles('reviewer').subscribe(
      (data) => {
        this.reviewers = data;
      },
      (error) => {
        console.error(error);
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

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showNotifDropdown = false;
  }

  toggleNotifDropdown(){
    this.showNotifDropdown = !this.showNotifDropdown;
    this.isDropdownOpen = false;
  }

  logout() {
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/publication']);
    });
  } 
}
