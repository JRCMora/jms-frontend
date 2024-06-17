import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RubricService } from '../rubric.service';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-rubric',
  templateUrl: './view-rubric.component.html',
  styleUrls: ['./view-rubric.component.css']
})
export class ViewRubricComponent implements OnInit {
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isReviewer: boolean = false;
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  rubric: any;

  constructor(
    private route: ActivatedRoute,
    private rubricService: RubricService,
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchRubric();

    // Retrieve user role from session storage
    const userRole = sessionStorage.getItem('userRole');
    // Check if the user is an admin, superadmin, or reviewer
    this.isAdmin = userRole === 'admin';
    this.isSuperAdmin = userRole === 'superadmin';
    this.isReviewer = userRole === 'reviewer';
  }

  fetchRubric() {
    const rubricId = this.route.snapshot.paramMap.get('rubricId'); // Get the rubricId from the route params
    if (rubricId) {
      this.rubricService.getRubricById(rubricId).subscribe(
        (rubric: any) => { // Explicitly define the type of rubric
          // Sort levels in descending order based on score
          rubric.components.forEach((component: any) => { // Explicitly define the type of component
            component.levels.sort((a: any, b: any) => b.score - a.score); // Explicitly define the types of a and b
          });
          this.rubric = rubric; // Assign the fetched rubric data to the property
        },
        (error) => {
          console.error('Error fetching rubric:', error);
        }
      );
    }
  }

  getTotalScore(levels: any[]): number {
    let totalScore = 0;
    levels.forEach(level => {
      totalScore += level.score;
    });
    return totalScore;
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
