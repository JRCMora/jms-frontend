import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-f-pass',
  templateUrl: './f-pass.component.html',
  styleUrls: ['./f-pass.component.css']
})
export class FPassComponent {
  email: string = '';

  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) {}

  submitEmail() {
    this.userService.forgotPassword(this.email).subscribe(
      (response) => {
        console.log('Reset password email sent');
        // Optionally, you can show a success message to the user
        this.snackBar.open('Reset password email sent.', 'Close', { duration: 3000, verticalPosition: 'top' });
      },
      (error) => {
        console.error('Error sending reset password email:', error);
        this.snackBar.open('Error sending reset password to email failed.', 'Close', { duration: 3000, verticalPosition: 'top' });
      }
    );
  }

  returnToLogin(): void {
    this.router.navigate(['/login']);
  }

}