import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  currentPage = 1;
  itemsPerPage = 5;
  sortDirection: string = 'asc'; // Default sorting direction
  sortColumn: string = '';

  constructor(private authService: AuthService, 
              private router: Router, 
              private userService: UserService,
              private snackBar: MatSnackBar) {}


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
  const userRole = sessionStorage.getItem('userRole');
  this.isSuperAdmin = userRole === 'superadmin';
  this.isAdmin = userRole === 'admin';
  this.loadUsers();
}

editUser(userId: string) {
  this.router.navigate(['/admin/user-management/edit-user', userId]);
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
    this.userService.getUsers().subscribe(
      (data) => {
        if (this.isSuperAdmin === true)
        {
          // Filter users by roles excluding 'superadmin'
            this.users = data.filter(user => user.role !== 'superadmin')
              .map((user, index) => ({ ...user, id: index + 1 }));
            this.filteredUsers = [...this.users];
        } else if (this.isAdmin === true){
          // Filter users by roles 'reviewer' and 'author'
          this.users = data.filter(user => user.role === 'reviewer' || user.role === 'author')
                        .map((user, index) => ({ ...user, id: index + 1 }));
        this.filteredUsers = [...this.users];
        }
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

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
          user.role.toLowerCase().includes(searchTerm)
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
