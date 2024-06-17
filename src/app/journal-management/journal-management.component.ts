import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';
import { JournalService } from '../journal.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-journal-management',
  templateUrl: './journal-management.component.html',
  styleUrls: ['./journal-management.component.css']
})
export class JournalManagementComponent {
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  journals: any[] = [];
  filteredJournals: any[] = [];
  searchQuery: string = '';
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages: number = 0;
  sortDirection: string = 'asc'; 
  sortColumn: string = ''; 

  constructor(private authService: AuthService,
    private router: Router,
    private journalService: JournalService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) { }


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
  this.loadJournals();
  this.route.queryParams.subscribe((params: Params) => {
    const page = params['page'];
    if (page === 'last') {
      // Load journals first and then calculate the last page
      this.loadJournals(() => {
        this.calculateTotalPages();
        this.currentPage = this.totalPages; 
        // Navigate to the last page if the current page is greater than total pages
        if (this.currentPage > this.totalPages) {
          this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.totalPages } });
        }
      });
    } else if (page) {
      this.currentPage = parseInt(page, 10); // Parse page to integer
    }
  });
}

loadReviewers(): void {
  const reviewerIds = this.journals.flatMap(journal => journal.reviewers);
  this.userService.getReviewersByIds(reviewerIds).subscribe(
    (reviewers: any[]) => {
      this.journals.forEach(journal => {
        journal.reviewerNames = reviewers
          .filter(reviewer => journal.reviewers.includes(reviewer._id))
          .map(reviewer => `${reviewer.firstName} ${reviewer.lastName}`);
      });
    },
    (error) => {
      console.error(error);
    }
  );
}

sortJournals(column: string) {
  // If the same column is clicked, toggle the sorting direction
  if (column === this.sortColumn) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // If a different column is clicked, reset the sorting direction to ascending
    this.sortDirection = 'asc';
    this.sortColumn = column;
  }

  // Sort the journals based on the selected column and direction
  this.filteredJournals.sort((a, b) => {
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

deleteJournal(journalId: string) {
  if (confirm("Are you sure you want to delete this journal?")) {
    this.journalService.deleteJournal(journalId).subscribe(
      () => {
        // Remove the deleted journal from the local array
        this.loadJournals();
        this.snackBar.open('Delete Success', 'Close', { duration: 3000, verticalPosition: 'top'});
      },  
      (error) => {
        console.error("Error deleting journal:", error);
        this.snackBar.open('Delete failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
      }
    );
  }
}

loadJournals(callback: () => void = () => {}): void {
  this.journalService.getJournals().subscribe(
    (data) => {
      this.journals = data.map((journal, index) => ({ ...journal, id: index + 1 }));
      this.loadReviewers(); 
      this.filteredJournals = [...this.journals];
      this.calculateTotalPages();
      callback();
    },
    (error) => {
      console.error(error);
      this.snackBar.open('Assign failed!', 'Close', { duration: 3000, verticalPosition: 'top' });
    }
  );
}


filterJournals() {
  if (!this.searchQuery.trim()) {
    this.currentPage = 1; 
    this.filteredJournals = [...this.journals];
  } else {
    const searchTerm = this.searchQuery.toLowerCase().trim().replace(/\s+/g, ' '); // Replace consecutive spaces with a single space
    this.filteredJournals = this.journals.filter(journal => {
      const authorString = Array.isArray(journal.authors) ? journal.authors.join(', ') : journal.authors;
      return (
        journal.journalTitle.toLowerCase().includes(searchTerm) ||
        (typeof authorString === 'string' && authorString.toLowerCase().includes(searchTerm)) ||
        journal.status.toLowerCase().includes(searchTerm) ||
        (journal.reviewerNames && journal.reviewerNames.some((reviewerName: string) => reviewerName.toLowerCase().includes(searchTerm)))
      );
    });
    this.currentPage = 1;
  }
}


publishJournal(journal: any) {
  const journalId = journal._id;
  const currentDate = new Date().toISOString(); // Get the current date in ISO format
  const updatedJournalData = { status: 'Published', publicationDate: currentDate };

  this.journalService.publishJournal(journalId, updatedJournalData).subscribe(
    () => {
      // Update the status and publication date locally
      const updatedJournal = this.journals.find(j => j._id === journalId);
      if (updatedJournal) {
        updatedJournal.status = 'Published';
        updatedJournal.publicationDate = currentDate;
      }

      // Update the journal status to 'Published'
      this.journalService.updateJournalStatus(journalId, 'Published').subscribe(
        (response: any) => {
          console.log('Journal status updated to Published');
        },
        (error: any) => {
          console.error('Error updating journal status:', error);
        }
      );

      this.snackBar.open('Journal published successfully!', 'Close', { duration: 3000, verticalPosition: 'top' });
    },
    (error) => {
      console.error('Error publishing journal:', error);
      this.snackBar.open('Failed to publish journal!', 'Close', { duration: 3000, verticalPosition: 'top' });
    }
  );
}
  
assignReviewer(journal: any) {
  if (journal.status === "Under Review" || journal.status === "Under Review (Revision)") {
    this.router.navigate(['/admin/review-management/reassign-reviewer', journal._id, journal.journalTitle])
  }
  else {
    this.router.navigate(['/admin/review-management/assign-reviewer', journal._id, journal.journalTitle]);
  }
}

  viewConsolidatedFeedback(journalId: string) {
    // Navigate to the consolidated feedback page with the journalId
    this.router.navigate(['/admin/consolidation-feedback', journalId]);
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showNotifDropdown = false;
  }

  toggleNotifDropdown() {
    this.showNotifDropdown = !this.showNotifDropdown;
    this.isDropdownOpen = false;
  }

  onPageChange(page: number) {
    // Navigate to the same route with the page parameter
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: page } });
  }



  // Calculate the index of the first item displayed on the current page
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  // Calculate the index of the last item displayed on the current page
  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.filteredJournals.length - 1);
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredJournals.length / this.itemsPerPage);
    const visiblePages = Math.min(totalPages, 5);
    const startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  goToPage(pageNumber: number) {
    // Navigate to the same route with the page parameter
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: pageNumber } });
  }

  goToFirstPage() {
    this.onPageChange(1);
  }

  goToLastPage() {
    this.onPageChange(this.totalPages);
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredJournals.length / this.itemsPerPage);
  }
  
  logout() {
    this.snackBar.open('Logout successful.', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigate(['publication'])
  } 
  
}
