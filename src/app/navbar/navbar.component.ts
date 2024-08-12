import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CreatePostComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() searchEvent = new EventEmitter<string>();

  constructor(private authService: AuthService, private router: Router)
  {

  }

  logOut() {
    this.authService.signOut().then(() => {
      console.log('Signed out');
      this.authService.updateCurrentUser();
      this.router.navigate(['login']);
    }).catch(error => {
      console.error('Error signing out', error);
      alert(`Error signing out  ${error.message}`);      
    });
  }

  onSearch(event: Event, searchTerm: string) {
    event.preventDefault(); // Prevent the default form submission behavior
    this.searchEvent.emit(searchTerm);    
  }

}
