import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(HeaderComponent) child!:HeaderComponent;
  loginForm!: FormGroup;
  errorMessage: string = ''; 

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router,) { }

  ngOnInit(): void {
    // Initialize the reactive form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      debugger;
      this.child.onPageReload();

      this.authService.login(loginData).subscribe({
    
        next: (response) => {
          debugger;
          console.log('Login successful', response);
          localStorage.setItem('authToken', response.token); 
          localStorage.setItem('user',response.username);
          localStorage.setItem('role',response.role);
          this.router.navigate(['/customer-details']); 
        },
        error: (error) => {
          this.errorMessage = "Invalid username or password. Please try again.";
        }
      });
    }
  }
}
