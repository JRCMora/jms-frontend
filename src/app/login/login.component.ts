import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  passwordVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Check if user credentials are stored in local storage
    const storedEmail = sessionStorage.getItem('rememberedEmail');
    const storedPassword = sessionStorage.getItem('rememberedPassword');

    if (storedEmail && storedPassword) {
      this.email = storedEmail;
      this.password = storedPassword;
      this.rememberMe = true;
    }
  }

  login() {
    const user = { email: this.email, password: this.password };

    this.authService.login(user).subscribe(
      (response) => {
        console.log(response);
        // Save token to localStorage or a cookie
        // Save token and userId to localStorage or a cookie
        sessionStorage.setItem('userId', response.userId);
        sessionStorage.setItem('userRole', response.role);
        // Redirect to appropriate dashboard based on user role
        this.authService.setIsUserLogged(response.status);
        this.authService.getUserIsLogged().subscribe({
          next: (isAuth) => {
            if (isAuth) {
              if (response.role === 'superadmin') {
                this.router.navigate(['/admin/dashboard']);
              }
              if (response.role === 'admin') {
                this.router.navigate(['/admin/dashboard']);
              } else if (response.role === 'reviewer') {
                this.router.navigate(['/reviewer/dashboard']);
              } else if (response.role === 'author') {
                this.router.navigate(['/researcher/dashboard']);
              }
            }
          },
          error: (isAuthErr) => {
            console.error(isAuthErr);
          }
        });

        // Save email and password to local storage if "Remember Me" is checked
        if (this.rememberMe) {
          sessionStorage.setItem('rememberedEmail', this.email);
          sessionStorage.setItem('rememberedPassword', this.password);
        } else {
          // Clear remembered credentials if "Remember Me" is not checked
          sessionStorage.removeItem('rememberedEmail');
          sessionStorage.removeItem('rememberedPassword');
        }
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Login failed!', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Handle login error
      }
    );
  }
  
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
