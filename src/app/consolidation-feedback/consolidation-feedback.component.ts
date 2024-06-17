import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalService } from '../journal.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consolidation-feedback',
  templateUrl: './consolidation-feedback.component.html',
  styleUrls: ['./consolidation-feedback.component.css']
})
export class ConsolidationFeedbackComponent implements OnInit {
  unreadNotifications: any[] = [];
  showNotifDropdown: boolean = false;
  isDropdownOpen = false;
  journalId: string = ''; 
  feedback: any[] = []; 
  consolidatedFeedback: string = ''; 
  adminChoice: string = ''; 
  journalTitle: string = '';
  

  constructor(private route: ActivatedRoute, 
              private journalService: JournalService, 
              private authService: AuthService, 
              private router: Router,
              private snackBar: MatSnackBar) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // Check if the click is inside the dropdown toggle button
  if (target.matches('.dropdown-toggle')) {
    this.toggleDropdown(); 
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
    this.route.paramMap.subscribe(params => {
      this.journalId = params.get('journalId') || ''; 
      if (this.journalId) {
        this.getJournalDetails();
        this.getConsolidateFeedback();
      }
    });
  }

  getJournalDetails(): void {
    this.journalService.getJournalById(this.journalId)
      .subscribe(
        (data) => {
          this.journalTitle = data.journalTitle;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getConsolidateFeedback(): void {
    this.journalService.getConsolidateFeedback(this.journalId)
      .subscribe(
        (data) => {
          // Map reviewer _id to their names
          this.feedback = data.feedback.map((item: any) => ({
            reviewer: item.reviewerName,
            feedback: item.feedback,
            choice: item.choice
          }));
        },
        (error) => {
          console.error(error);
        }
      );
  }

  submitConsolidatedFeedback(): void {
    this.journalService.submitConsolidatedFeedback(this.journalId, this.consolidatedFeedback, this.adminChoice)
      .subscribe(
        (data) => {
          console.log("Sent")
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Submit failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
        }
      );
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showNotifDropdown = false;
  }

  toggleNotifDropdown(){
    this.showNotifDropdown = !this.showNotifDropdown;
    this.isDropdownOpen = false;
  }

  logout() {
    this.snackBar.open('Logout successful.', 'Close', { duration: 3000, verticalPosition: 'top'});
    this.authService.setIsUserLogged(false);
    this.authService.clearUserId();
    this.router.navigate(['publication'])
  } 
  
}
