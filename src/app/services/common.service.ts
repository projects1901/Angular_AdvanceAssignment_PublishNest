import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, DocumentReference, getDoc } from '@angular/fire/firestore';
import { IArticle } from '../models/iarticle';
import { IAuthor } from '../models/iauthor';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private articlesCollection;

  constructor(private firestore: Firestore) { 
    this.articlesCollection = collection(this.firestore, 'articles')
  }

  async addArticle(article: IArticle): Promise<void> {
    const docRef = await addDoc(this.articlesCollection, article);
    console.log("Document written with ID: ", docRef.id);
  }

  async getArticles(): Promise<IArticle[]> {
    const querySnapshot = await getDocs(this.articlesCollection);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as IArticle;
      data.id = doc.id;
      return {
        ...data,
        publishDate: data.publishDate instanceof Timestamp ? data.publishDate.toDate() : new Date(data.publishDate)
      };
    });
  }

  async getAllUsers(): Promise<IAuthor[]> {
    const usersCollection = collection(this.firestore, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    return usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id, 
        name: data['displayName'] || '', 
        profilePictureUrl: data['photoURL'] || '', 
        bio: data['bio'] || data['displayName'] + ' is a poet, teacher, and author of the new novel We Were Already There.'
      } as IAuthor;
    });
  }

  async getArticleById(articleId: string): Promise<IArticle | null> {
    const articleDocRef: DocumentReference = doc(this.firestore, 'articles', articleId);
    const articleDocSnapshot = await getDoc(articleDocRef);
    
    if (articleDocSnapshot.exists()) {
      const data = articleDocSnapshot.data() as IArticle;
      return {
        ...data,
        id: articleDocSnapshot.id,
        publishDate: data.publishDate instanceof Timestamp ? data.publishDate.toDate() : new Date(data.publishDate)
      };
    } else {
      console.log("No such document!");
      return null;
    }
  }
}
