import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RubricService } from '../rubric.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-rubric',
  templateUrl: './create-rubric.component.html',
  styleUrls: ['./create-rubric.component.css']
})
export class CreateRubricComponent {
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  rubric: any = {
    name: '',
    description: '',
    components: [{ name: '', description: '', levels: [{ label: '', description: '', score: 0 }] }]
  };

  constructor(private rubricService: RubricService, 
              private router: Router, 
              private authService: AuthService, 
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Retrieve user role from session storage
    const userRole = sessionStorage.getItem('userRole');
    // Check if the user is an admin or superadmin
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

  saveRubric() {
    console.log(this.rubric);
    // Call the rubricService to save the rubric
    this.rubricService.createRubric(this.rubric).subscribe(
      (response) => {
        console.log('Rubric saved successfully', response);
        this.snackBar.open('Rubric saved successfully.', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Reset rubric data after saving
        this.rubric = {
          name: '',
          description: '',
          components: [{ name: '', description: '', levels: [{ label: '', description: '', scores: 0 }] }]
        };
        this.router.navigate(['/admin/rubric-management']);
      },
      (error) => {
        console.error('Error saving rubric', error);
        this.snackBar.open('Save failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Handle error if necessary
      }
    );
  }
  
  removeComponent(componentIndex: number) {
    this.snackBar.open('Criteria Removed!', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.rubric.components.splice(componentIndex, 1);
  }  

  addComponent() {
    this.rubric.components.push({ name: '', description: '', levels: [{ label: '', description: '', scores: 0 }] });
  }

  removeScore(componentIndex: number, scoreIndex: number) {
    this.snackBar.open('Score Removed!', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.rubric.components[componentIndex].levels.splice(scoreIndex, 1);
  }

  addScore(componentIndex: number) {
    this.rubric.components[componentIndex].levels.push({ label: '', description: '', scores: 0 });
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
