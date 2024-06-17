import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    email: string = '';
    firstName: string = '';
    lastName: string = '';
    password: string = '';
    role: string = 'author';
    passwordVisible: boolean = false;
    showPasswordCriteria: boolean = false;

    constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}

    register() {
      if (!this.isPasswordValid()) {
        this.snackBar.open('Password does not meet the criteria!', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: ['error-snackbar']});
        return;
      }

      const user = { email: this.email, firstName: this.firstName, lastName: this.lastName, password: this.password, role: this.role};

      this.authService.register(user).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/verify-email/', this.email]);
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Registration failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
        }
      );
    }

    togglePasswordVisibility(): void {
      this.passwordVisible = !this.passwordVisible;
    }

    isAtLeastEightCharacters(): boolean {
      return this.password.length >= 8;
    }

    hasUppercaseLowercaseLetters(): boolean {
      return /[a-z]/.test(this.password) && /[A-Z]/.test(this.password);
    }

    hasSpecialCharacter(): boolean {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    }

    isPasswordValid(): boolean {
      return this.isAtLeastEightCharacters() && this.hasUppercaseLowercaseLetters() && this.hasSpecialCharacter();
    }
}
