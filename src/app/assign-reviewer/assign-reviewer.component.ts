import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from '../journal.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { RubricService } from '../rubric.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-reviewer',
  templateUrl: './assign-reviewer.component.html',
  styleUrls: ['./assign-reviewer.component.css']
})
export class AssignReviewerComponent {
  isDropdownOpen = false;
  userId: string = '';
  selectedJournal: string = '';
  reviewer1: string = '';
  reviewer2: string = '';
  reviewer3: string = '';
  journalTitle: string = '';
  reviewers: any[] = [];
  journals: any[] = [];
  selectedRubric: string = ''; // Add a variable to store the selected rubric ID
  rubrics: any[] = [];

  constructor(private authService: AuthService, 
              private route: ActivatedRoute, 
              private router: Router, 
              private userService: UserService, 
              private journalService: JournalService, 
              private snackBar: MatSnackBar,
              private rubricService: RubricService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const journalId = params.get('journalId');
      const journalTitle = params.get('journalTitle');
      if (journalId && journalTitle) {
        this.selectedJournal = journalId;
        this.journalTitle = journalTitle;
        this.loadReviewers();
        this.loadRubrics();
      }
    });
  }

  loadRubrics(): void {
    // Fetch all rubrics from the server
    this.rubricService.getRubrics().subscribe(
      (data: any[]) => {
        this.rubrics = data;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  loadReviewers(): void {
    this.userService.getRoles('reviewer').subscribe(
      (data: any[]) => {
        this.reviewers = data;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  assignReviewer(): void {
    
    const reviewerIds = [this.reviewer1, this.reviewer2, this.reviewer3];
    const rubricId = this.selectedRubric; // Get the selected rubricId
  
    // Check if all required fields are filled
    if (!this.selectedJournal || !reviewerIds.every(id => !!id) || !rubricId) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000, verticalPosition: 'top'});
      console.error('Please fill in all required fields.'); // Handle validation error
      return;
    }
  
    // Call the journal service method to assign reviewers
    this.journalService.assignReviewers(this.selectedJournal, reviewerIds, rubricId).subscribe(
      (response: any) => {
        console.log(response.message); // Log success message
        
        // Reload reviewers list to reflect updated status
        this.loadReviewers();
         // Update the journal status to 'Under Review' after assigning reviewers
         this.updateJournalStatus(this.selectedJournal);
        this.router.navigate(['/admin/journal-management']);
      },
      (error: any) => {
        console.error(error);
        // Handle error
      }
    );
  }

  // Method to update journal status to 'Under Review'
  updateJournalStatus(journalId: string): void {
    this.journalService.updateJournalStatus(journalId, 'Under Review').subscribe(
      (response: any) => {
        this.snackBar.open('Journal status updated to "Under Review"', 'Close', { duration: 3000, verticalPosition: 'top'});
        console.log('Journal status updated to "Under Review"');
      },
      (error: any) => {
        this.snackBar.open('Error updating journal status.', 'Close', { duration: 3000, verticalPosition: 'top'});
        console.error('Error updating journal status:', error);
      }
    );
  }
  
  filteredReviewers(selectedReviewer1: string, selectedReviewer2: string): any[] {
    return this.reviewers.filter(reviewer => reviewer._id !== selectedReviewer1 && reviewer._id !== selectedReviewer2);
  }
  

  logout() {
    this.snackBar.open('Logout successful.', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigate(['publication'])
  } 

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
}
