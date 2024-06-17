import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetToken: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.resetToken = params['resetToken'];
    });
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000, verticalPosition: 'top' });
      return;
    }

    this.userService.resetPassword(this.resetToken, this.newPassword).subscribe(
      (response) => {
        console.log('Password reset successfully');
        this.snackBar.open('Password reset successfully', 'Close', { duration: 3000, verticalPosition: 'top' });
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error resetting password:', error);
        this.snackBar.open('Error resetting password', 'Close', { duration: 3000, verticalPosition: 'top' });
      }
    );
  }
}
