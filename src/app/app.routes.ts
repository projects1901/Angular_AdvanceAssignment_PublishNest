import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { CreatePostComponent } from './create-post/create-post.component';
import { AuthorDirectoryComponent } from './author-directory/author-directory.component';
import { ViewArticlesComponent } from './view-articles/view-articles.component';
import { CommentsComponent } from './comments/comments.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'home/create', component: CreatePostComponent, canActivate: [authGuard]},
    { path: 'home/login', component: LoginComponent },
    { path: 'author-directory', component: AuthorDirectoryComponent, canActivate: [authGuard] },
    { path: 'home/author-directory', component: AuthorDirectoryComponent, canActivate: [authGuard] },
    { path: 'create', component: CreatePostComponent, canActivate: [authGuard] },
    { path: 'view-article/:id', component: ViewArticlesComponent, canActivate: [authGuard] },
    { path: 'comment/:id', component: CommentsComponent, canActivate: [authGuard] }
];
