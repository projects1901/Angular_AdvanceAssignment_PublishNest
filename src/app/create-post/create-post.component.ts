import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular'
import { IArticle } from '../models/iarticle';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

declare var tinymce: any;

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [EditorComponent, FormsModule, NgIf],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {

  private editor: any;
  editorConfig = {
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
    ]
  }; 
  content: string = "";
  title: string = '';
  imagePath: string = '';
  description: string = '';

  article: IArticle = {
    id: '',
    title: '',
    thumbnail: '',
    description: '',
    authorName: '',
    publishDate: new Date(),
    content: ''
  };

  constructor(private auth: AuthService, private commonService: CommonService, private router: Router)
  {

  }

  ngOnInit()  {

  }
  

  onEditorInit(editor: any): void {
    this.editor = editor;
  }

  preview()
  {
    if (this.editor) {
      this.content = this.editor.editor.getBody().innerHTML;
    } else {
      console.error('Editor instance is not available.');
    }
  }

  saveContent(): void {
    if (this.editor) {
      this.content = this.editor.editor.getBody().innerHTML;
      this.updateModel();
      this.commonService.addArticle(this.article).then(() => {
        alert("Article Saved Successfully.")
        console.log('Article saved successfully.');
      }).catch(error => {
        console.error('Error adding document: ', error);
      });
      console.log('Content to save:', this.content);
    } else {
      alert('Editor instance is not available.');
    }
  }

  updateModel()
  {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.content, 'text/html');
    
    // Extract the first heading
    const heading = doc.querySelector('h1, h2, h3, h4, h5, h6');
    this.article.title = heading ? heading.textContent || "" : "dummy title";

    // Extract the first image path
    const image = doc.querySelector('img');
    this.article.thumbnail = image ? image.getAttribute('src') || '' : '';

    // Extract the first paragraph, limited to 200 characters
    const paragraph = doc.querySelector('p');
    this.article.description = paragraph ? paragraph.textContent?.substring(0, 200) || '' : 'dummy description';

    this.article.content = this.content;
    this.article.authorName = this.auth.user?.displayName ?? "";
    this.article.publishDate = new Date();
  }


  }
