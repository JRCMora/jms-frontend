import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from '../journal.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { RubricService } from '../rubric.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reassign-reviewer',
  templateUrl: './reassign-reviewer.component.html',
  styleUrls: ['./reassign-reviewer.component.css']
})
export class ReassignReviewerComponent {
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
  currentReviewer1: any = {};
  currentReviewer2: any = {};
  currentReviewer3: any = {};
  

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
        this.loadCurrentReviewers(journalId); // Load current assigned reviewers
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

  loadCurrentReviewers(journalId: string): void {
    this.journalService.getJournalById(journalId).subscribe(
      (journal: any) => {
        const reviewerIds = journal.reviewers; // Get reviewer IDs from the journal
  
        // Fetch reviewers by their IDs
        this.userService.getReviewersByIds(reviewerIds).subscribe(
          (reviewers: any[]) => {
            // Assign current reviewers to variables with their names
            this.currentReviewer1 = reviewers.find(reviewer => reviewer._id === journal.reviewers[0]) || {};
            this.currentReviewer2 = reviewers.find(reviewer => reviewer._id === journal.reviewers[1]) || {};
            this.currentReviewer3 = reviewers.find(reviewer => reviewer._id === journal.reviewers[2]) || {};
          },
          (error) => {
            console.error(error);
            // Handle error
          }
        );
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
  

  assignReviewer(): void {
    const reviewerIds = [
      this.reviewer1 || this.currentReviewer1._id, // Use current value if not modified
      this.reviewer2 || this.currentReviewer2._id, // Use current value if not modified
      this.reviewer3 || this.currentReviewer3._id  // Use current value if not modified
    ];
    const rubricId = this.selectedRubric; // Get the selected rubricId
  
    // Check if all required fields are filled
    if (!this.selectedJournal) {
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
  this.journalService.getJournalById(journalId).subscribe(
    (data: any) => {
      const status = data.status; // Assuming the API response contains the status of the journal
      if (status === "Under Review (Revision)") {
        this.journalService.updateJournalStatus(journalId, 'Under Review (Revision)').subscribe(
          (response: any) => {
            console.log('Journal status updated to "Under Review (Revision)"');
          },
          (error: any) => {
            console.error('Error updating journal status:', error);
          }
        );
      } else if (status === "Under Review"){
        this.journalService.updateJournalStatus(journalId, 'Under Review').subscribe(
          (response: any) => {
            console.log('Journal status updated to "Under Review"');
          },
          (error: any) => {
            console.error('Error updating journal status:', error);
          }
        );
      }
    },
    (error: any) => {
      console.error(error);
      // Handle error scenario
    }
  );
}
  
  filteredReviewers(selectedReviewer1: string, selectedReviewer2: string): any[] {
    return this.reviewers.filter(reviewer => {
      return reviewer._id !== selectedReviewer1 &&
             reviewer._id !== selectedReviewer2 &&
             reviewer._id !== this.currentReviewer1._id &&
             reviewer._id !== this.currentReviewer2._id &&
             reviewer._id !== this.currentReviewer3._id;
    });
  }
  
  
  logout() {
    this.authService.setIsUserLogged(false);
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
