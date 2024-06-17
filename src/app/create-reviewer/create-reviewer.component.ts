import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-reviewer',
  templateUrl: './create-reviewer.component.html',
  styleUrls: ['./create-reviewer.component.css']
})
export class CreateReviewerComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  role: string = 'reviewer';

  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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

  register() {
    const user = { email: this.email, firstName: this.firstName, lastName: this.lastName, password: this.password, role: this.role};

    this.authService.register(user).subscribe(
      (response) => {
        console.log(response);
        // Navigate back to review management page
        this.router.navigate(['/admin/reviewer-management']);
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Registrtion failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Handle registration error
      }
    );
  }

  logout() {
    this.authService.setIsUserLogged(false);
    this.router.navigate(['publication'])
    }
}