import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Retrieve the email from the route parameters
    this.route.params.subscribe(params => {
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
}