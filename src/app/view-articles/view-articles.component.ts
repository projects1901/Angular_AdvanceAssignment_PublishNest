import { Component } from '@angular/core';
import { CommonService } from '../services/common.service';
import { IArticle } from '../models/iarticle';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-view-articles',
  standalone: true,
  imports: [NgIf],
  templateUrl: './view-articles.component.html',
  styleUrl: './view-articles.component.scss'
})
export class ViewArticlesComponent {
  constructor(private commonService: CommonService, private route: ActivatedRoute, private router: Router)
  {    
  }

  article: IArticle = {
    id: '',
    title: '',
    thumbnail: '',
    description: '',
    authorName: '',
    publishDate: new Date(),
    content: ''
  };
  content = "";

  ngOnInit()
  {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.commonService.getArticleById(id).then((article) => {
        if (article) {
          this.article = article;
          this.content = article.content;
        }
      }).catch((error) => {
        console.error('Error fetching article:', error);
      });
      
    }
  }

  comment(article: IArticle)
  {
    this.router.navigate(['comment/', article.id]);
  }

}
