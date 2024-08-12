import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, NgFor } from '@angular/common';
import { IAuthor } from '../models/iauthor'
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-author-directory',
  standalone: true,
  imports: [RouterModule, NavbarComponent, NgFor, CommonModule],
  templateUrl: './author-directory.component.html',
  styleUrl: './author-directory.component.scss'
})

export class AuthorDirectoryComponent {

  authors: IAuthor[] = [];

  filteredAuthors: IAuthor[] = [...this.authors];
  isLoading: boolean = true;

  constructor(private authService:AuthService, private commonService: CommonService)
  {
    this.loadAuthors();
  }
  ngOnInit()
  {
    this.commonService.getAllUsers().then(users => {
      this.authors = users;
      this.filteredAuthors = users;
      console.log('Authors:', this.authors);
    }).catch(error => {
      console.error('Error fetching users:', error);
    });
  }

  async loadAuthors() {
    try {
      
      console.log(this.authors);
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading articles:', error);
      this.isLoading = false;
    }
  }

  onSearch(searchTerm: string) {
    this.filteredAuthors = this.authors.filter(author =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

}
