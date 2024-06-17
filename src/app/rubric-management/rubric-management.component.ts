import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { RubricService } from '../rubric.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rubric-management',
  templateUrl: './rubric-management.component.html',
  styleUrls: ['./rubric-management.component.css']
})

export class RubricManagementComponent {
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  rubrics: any[] = [];
  filteredRubrics: any[] = [];
  searchQuery: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  sortDirection: string = 'asc'; // Default sorting direction
  sortColumn: string = ''; // Default sorting column


  constructor(
    private authService: AuthService,
    private router: Router,
    private rubricService: RubricService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.fetchRubrics();
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

fetchRubrics() {
  this.rubricService.getRubrics().subscribe(
    (rubrics: any[]) => {
      this.rubrics = rubrics.map((rubric, index) => ({
        ...rubric,
        displayedId: index + 1 // Assign a new property for displayed ID starting from 1
      }));
      this.filteredRubrics = [...this.rubrics];
    },
    (error) => {
      console.error('Error fetching rubrics:', error);
    }
  );
}

deleteRubric(rubricId: string) {
  if (confirm('Are you sure you want to delete this rubric?')) {
    this.rubricService.deleteRubrics(rubricId).subscribe(
      () => {
        // Reload users after successful deletion
        this.fetchRubrics();
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

sortRubrics(column: string) {
  // If the same column is clicked, toggle the sorting direction
  if (column === this.sortColumn) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // If a different column is clicked, reset the sorting direction to ascending
    this.sortDirection = 'asc';
    this.sortColumn = column;
  }

  // Sort the rubrics based on the selected column and direction
  this.filteredRubrics.sort((a, b) => {
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


viewRubric(rubricId: string) {
  this.router.navigate(['/admin/rubric-management/view-rubric/', rubricId]);
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

  // Method to filter rubrics based on search query
  filterRubrics() {
    if (this.searchQuery.trim() !== '') {
      this.currentPage = 1;
      this.filteredRubrics = this.rubrics.filter(rubric =>
        rubric.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredRubrics = [...this.rubrics];
      this.currentPage = 1;
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
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.filteredRubrics.length - 1);
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredRubrics.length / this.itemsPerPage);
    const visiblePages = Math.min(totalPages, 5); // Maximum 5 pages shown
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
  
}
