import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-verify-email-result',
  templateUrl: './verify-email-result.component.html',
  styleUrls: ['./verify-email-result.component.css']
})
export class VerifyEmailResultComponent {
  verificationResult: { success: boolean, message: string } = { success: false, message: '' };
  email: string = '';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Retrieve verification result from route parameters
    this.route.queryParams.subscribe(params => {
      this.verificationResult = {
        success: params['success'] === 'true',
        message: params['success'] === 'true' ? 'Your email has been successfully verified.' : 'Invalid or expired verification token. Please try to resend verification email.'
      };
    });

    // Retrieve email from route parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  resendVerificationEmail(): void {
    this.userService.resendVerificationEmail(this.email).subscribe(
      () => {
        this.snackBar.open('Verification email resent successfully.', 'Close', { duration: 3000, verticalPosition: 'top'});
      },
      (error) => {
        console.error('Error resending verification email:', error);
        this.snackBar.open('Failed to resend verification email. Please try again later.', 'Close', { duration: 3000, verticalPosition: 'top'});
      }
    );
  }


  returnToLogin(): void {
    this.router.navigate(['/login']);
  }

  closeAlert(): void {
    // Implement logic to close alert
  }
}