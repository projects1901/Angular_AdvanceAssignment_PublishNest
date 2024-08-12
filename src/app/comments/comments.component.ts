import { Component, Input } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { IComment } from '../models/icomment';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {

  articleId: string = "";
  comments$: BehaviorSubject<IComment[]> = new BehaviorSubject<IComment[]>([]);
  sortOption: 'newest' | 'oldest' | 'mostLiked' = 'newest';
  newComment: string = '';
  replyContent: string = '';
  currentUserName= "";
  userId= "";

  constructor(private firestore: Firestore, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('id') ?? "";
    this.userId = this.authService.user?.uid ?? "";
    this.currentUserName = this.authService.user?.displayName ?? "";
    this.loadComments();
  }

  async loadComments() {
    const commentsRef = collection(this.firestore, 'comments');
    const commentsQuery = query(commentsRef, where('articleId', '==', this.articleId), orderBy('timestamp', 'desc'));
    const commentDocs = await getDocs(commentsQuery);
    // const comments: IComment[] = commentDocs.docs.map(doc => doc.data() as IComment);
    const comments: IComment[] = commentDocs.docs.map(doc => {
      const data = doc.data() as IComment;
      data.id = doc.id; // Set the IComment id to the document id
      return data;
  });
  
    const commentMap = new Map<string, IComment>();
    comments.forEach(comment => {
      comment.replies = [];
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId);
        parentComment?.replies?.push(comment);
      } else {
        commentMap.set(comment.id!, comment);
      }
    });
  
    this.comments$.next(Array.from(commentMap.values()));
  }
  

  async postComment(content: string, parentId?: string) {
    const comment: IComment = {
      articleId: this.articleId,
      userId: this.userId, 
      username: this.currentUserName, 
      content,
      timestamp: Date.now(),
      likes: 0,
      parentId: parentId || null,
    };

    const commentsRef = collection(this.firestore, 'comments');
    await addDoc(commentsRef, comment);
    this.loadComments();
  }

  sortComments(option: 'newest' | 'oldest' | 'mostLiked') {
    this.sortOption = option;
    this.loadComments();
  }

}
