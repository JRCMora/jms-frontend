import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: any;
  roles: string[] = ['reviewer', 'author'];

  constructor(private authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private userService: UserService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId'); // Get the user ID from route parameters
      if (userId) {
        this.userService.getUserById(userId).subscribe(
          (user: any) => {
            this.user = user;
          },
          (error: any) => {
            console.error('Error fetching user:', error);
          }
        );
      }
    });
  }

  saveChanges() {
    // Call the user service to update the user information
    this.userService.updateUser(this.user).subscribe(
      (updatedUser: any) => {
        this.snackBar.open('Changes saved successfully', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Optionally, navigate to another page or handle success
      },
      (error: any) => {
        console.error('Error saving changes:', error);
        this.snackBar.open('Error saving changes!', 'Close', { duration: 3000, verticalPosition: 'top'});
        // Handle error
      }
    );
  }
}
