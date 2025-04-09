import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated: boolean = false;
  userRole: string; 
  userName:string;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = !!localStorage.getItem('authToken');
    this.onPageReload();
    
  }

  onPageReload()
  {
    debugger;
    this.userRole=localStorage.getItem('role') ;
    this.userName=localStorage.getItem('user') ;
    console.log(this.userRole);
  }
  logout() {
    //this.onPageReload();
    this.authService.logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.userRole=null;
    this.userName=null;
    this.isAuthenticated = false;
  }
}
