import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { JournalService } from '../journal.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-management',
  templateUrl: './reviewer-management.component.html',
  styleUrls: ['./reviewer-management.component.css']
})
export class ReviewerManagementComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  currentPage = 1;
  itemsPerPage = 5;
  sortDirection: string = 'asc'; // Default sorting direction
  sortColumn: string = ''; // Default sorting column


  constructor(private authService: AuthService, 
              private router: Router, 
              private userService: UserService, 
              private journalService: JournalService,
              private snackBar: MatSnackBar ) {}


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

ngOnInit(): void {
  // Retrieve user role from session storage
  const userRole = sessionStorage.getItem('userRole');
  // Check if the user is an admin or superadmin
  this.isAdmin = userRole === 'admin';
  this.isSuperAdmin = userRole === 'superadmin';

  this.loadUsers();
}

// Method to load assigned journals for each reviewer
loadAssignedJournals(): void {
  this.users.forEach(user => {
    this.journalService.getAssignedJournals(user._id).subscribe(
      (assignedJournals: any[]) => {
        if (assignedJournals.length > 0) {
          // Map assigned journals to their titles
          user.assignedJournals = assignedJournals.map(journal => journal.journalTitle);
          user.status = 'Assigned'; // Set the status accordingly
        } else {
          user.assignedJournals = []; // Set empty array if no journals assigned
          user.status = 'Not Assigned'; // Set the status accordingly
        }
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  });
}

  // Sorting users method
  sortUsers(column: string) {
    // If the same column is clicked, toggle the sorting direction
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If a different column is clicked, reset the sorting direction to ascending
      this.sortDirection = 'asc';
      this.sortColumn = column;
    }
  
    // Sort the users based on the selected column and direction
    this.filteredUsers.sort((a, b) => {
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

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          // Reload users after successful deletion
          this.loadUsers();
          this.snackBar.open('Delete Success', 'Close', { duration: 3000, verticalPosition: 'top'});
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Delete Failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
          // Handle error
        }
      );
    }
  }
  
  loadUsers() {
    this.userService.getRoles('reviewer').subscribe(
      (data) => {
        this.users = data.map((user, index) => ({
          ...user,
          id: index + 1,
          assignedJournal: null // Initialize assignedJournal property
        }));
        this.loadAssignedJournals(); // Load assigned journals for each reviewer
        this.filteredUsers = [...this.users];
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
  
  filterUsers() {
    if (!this.searchQuery.trim()) {
      this.currentPage = 1; // Reset pagination to the first page
      this.filteredUsers = [...this.users];
    } else {
      const searchTerm = this.searchQuery.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user => {
        const fullName = `${user.firstName.trim()} ${user.lastName.trim()}`.toLowerCase();
        const nameRegExp = new RegExp(`\\b${searchTerm}\\b`, 'i'); // Match whole word, case insensitive
        return (
          user.id.toString().toLowerCase().includes(searchTerm) ||
          fullName.match(nameRegExp) || // Match exactly with full name
          user.email.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm) ||
          (user.assignedJournals && user.assignedJournals.some((journal: string) => journal.toLowerCase().includes(searchTerm))) ||
          user.status.toLowerCase().includes(searchTerm)
        );
      });
      this.currentPage = 1; // Reset pagination to the first page when a new search query is entered
    }
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
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.filteredUsers.length - 1);
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
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
