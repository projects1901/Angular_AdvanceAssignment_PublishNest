import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.loginSuccessful();
      })
      .catch(error => {
        this.errorMessage = error.message;
        alert(`Error signing in  ${this.errorMessage}`);        
      });
  }

  signInWithGoogle() {
    this.authService.googleSignIn().then(result => {
      //console.log('Signed in with Google', result);
      this.loginSuccessful();
    }).catch(error => {
      console.error('Error signing in with Google', error);
      alert(`Error signing in  ${error.message}`);
    });
  }

  signInWithFacebook() {
    this.authService.facebookSignIn().then(result => {
      //console.log('Signed in with Facebook', result);
      this.loginSuccessful();
    }).catch(error => {
      //console.error('Error signing in with Facebook', error);
      alert(`Error signing in  ${error.message}`);
    });
  }

  signOut() {
    this.authService.signOut().then(() => {
      //console.log('Signed out');
      this.authService.updateCurrentUser();
    }).catch(error => {
      //console.error('Error signing out', error);
      alert(`Error signing out  ${error.message}`);      
    });
  }

  loginSuccessful()
  {
    this.authService.updateCurrentUser();
    this.router.navigate(['home']);
  }

  register()
  {
    this.router.navigate(['register']);
  }

}
