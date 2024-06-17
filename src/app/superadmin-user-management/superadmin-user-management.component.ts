import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-superadmin-user-management',
  templateUrl: './superadmin-user-management.component.html',
  styleUrls: ['./superadmin-user-management.component.css']
})
export class SuperadminUserManagementComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;

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
  this.userService.getUsers().subscribe(
    (data) => {
      // Filter users by roles excluding 'superadmin'
      this.users = data.filter(user => user.role !== 'superadmin')
                      .map((user, index) => ({ ...user, id: index + 1 }));
      this.filteredUsers = [...this.users];
    },
    (error) => {
      console.error(error);
      // Handle error
    }
  );
}

  editUser(user: any) {
    // Implement edit functionality
  }

  deleteUser(userId: string) {
    // Implement delete functionality
  }

  filterUsers() {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const searchTerm = this.searchQuery.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user => {
        // Check if the fields are defined before calling toLowerCase()
        const id = user.id ? user.id.toString().toLowerCase() : '';
        const firstName = user.firstName ? user.firstName.toLowerCase() : '';
        const lastName = user.lastName ? user.lastName.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const role = user.role ? user.role.toLowerCase() : '';
  
        // Filter the users based on any of the fields containing the searchTerm
        return id.includes(searchTerm) ||
               firstName.includes(searchTerm) ||
               lastName.includes(searchTerm) ||
               email.includes(searchTerm) ||
               role.includes(searchTerm);
      });
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
