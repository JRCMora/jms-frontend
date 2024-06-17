import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  role: string = '';
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const userRole = sessionStorage.getItem('userRole');
    this.isAdmin = userRole === 'admin';
    this.isSuperAdmin = userRole === 'superadmin';
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

  register() {
    const user = { email: this.email, firstName: this.firstName, lastName: this.lastName, password: this.password, role: this.role};

    this.authService.register(user).subscribe(
      (response) => {
        console.log(response);
        // Navigate back to review management page
        if(this.isSuperAdmin === true){
          this.router.navigate(['/superadmin/user-management']);
        } else if (this.isAdmin === true){
          this.router.navigate(['/admin/user-management']);
        }
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Registrtion failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Handle registration error
      }
    );
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
