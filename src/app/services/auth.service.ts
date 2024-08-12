import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { IAuthor } from '../models/iauthor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | null = null;
  authors: IAuthor[] = [];

  constructor(private auth: Auth, private firestore: Firestore) { }

  // Common method to handle user sign-in
  private handleUserSignIn(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return getDoc(userRef).then(userDoc => {
      if (!userDoc.exists()) {
        // User does not exist, create a new document
        return setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName, // Optional
          photoURL: user.photoURL,       // Optional
        });
      }
      // If the user document exists, return a resolved promise
      return Promise.resolve(); // Ensures a value is returned
    });
  }

  googleSignIn(): Promise<User> {
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then(result => {
      const user = result.user;
      return this.handleUserSignIn(user).then(() => user); // Return the user object
    });
  }

  facebookSignIn(): Promise<User> {
    return signInWithPopup(this.auth, new FacebookAuthProvider()).then(result => {
      const user = result.user;
      return this.handleUserSignIn(user).then(() => user); // Return the user object
    });
  }

  // Register a new user with email and password
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(result => {
      const user = result.user;
      return this.handleUserSignIn(user).then(() => result); // Return the UserCredential
    });
  }

  // Login with email and password
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }

  updateCurrentUser() {
    this.user = this.auth.currentUser;
  }

  // Update user details (e.g., displayName, profilePictureUrl)
  updateUser(displayName: string) {
    // Implementation for updating user details
  }
}
