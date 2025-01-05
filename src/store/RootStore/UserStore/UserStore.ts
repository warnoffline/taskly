import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { auth } from '@/configs/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateEmail,
} from 'firebase/auth';

type PrivateFields = '_loading' | '_error' | '_user' | '_isAuthenticated';

class UserStore {
  private _user: string = '';
  private _loading: boolean = false;
  private _error: string | null = null;
  private _isAuthenticated: boolean = false;

  constructor() {
    makeObservable<UserStore, PrivateFields>(this, {
      _isAuthenticated: observable,
      _user: observable,
      _error: observable,
      _loading: observable,
      isAuthenticated: computed,
      error: computed,
      user: computed,
      loading: computed,
      setError: action.bound,
      signUp: action.bound,
      login: action.bound,
      logout: action.bound,
    });
    this.loadFromLocalStorage();
  }

  get error() {
    return this._error;
  }

  get user() {
    return this._user;
  }

  get loading() {
    return this._loading;
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  setError(msg: string) {
    this._error = msg;
  }

  async signUp(email: string, password: string): Promise<void> {
    this._loading = true;
    this._error = null;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      runInAction(() => {
        this._isAuthenticated = true;
        this._user = email;
      });

      this.saveToLocalStorage();
    } catch (err) {
      if (err instanceof Error) {
        this.handleFirebaseError(err);
      }
    } finally {
      this._loading = false;
    }
  }

  async login(email: string, password: string): Promise<void> {
    this._loading = true;
    this._error = null;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      runInAction(() => {
        this._isAuthenticated = true;
        this._user = email;
      });

      this.saveToLocalStorage();
    } catch (err) {
      if (err instanceof Error) {
        this.handleFirebaseError(err);
      }
    } finally {
      this._loading = false;
    }
  }

  async updateEmail(newEmail: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateEmail(user, newEmail);
        runInAction(() => {
          this._user = newEmail;
        });
        this.saveToLocalStorage();
      }
    } catch (err) {
      if (err instanceof Error) {
        this.handleFirebaseError(err);
      }
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await updatePassword(user, newPassword);
      }
    } catch (err) {
      if (err instanceof Error) {
        this.handleFirebaseError(err);
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      runInAction(() => {
        this._isAuthenticated = false;
        this._user = '';
      });
      this.removeFromLocalStorage();
    } catch (err) {
      if (err instanceof Error) {
        this._error = `Logout failed: ${(err as Error).message}`;
      }
    }
  }

  private handleFirebaseError(err: Error): void {
    const errorMessage = err.message;

    if (errorMessage.includes('auth/invalid-credential')) {
      this._error =
        'The provided credentials are invalid. Please check your login details or try using a different login method.';
    } else if (errorMessage.includes('auth/email-already-in-use')) {
      this._error = 'This email is already in use. Please use a different email.';
    } else if (errorMessage.includes('auth/invalid-email')) {
      this._error = 'The email address is not valid. Please check your email.';
    } else if (errorMessage.includes('auth/wrong-password')) {
      this._error = 'Incorrect password. Please try again.';
    } else if (errorMessage.includes('auth/user-not-found')) {
      this._error = 'No user found with this email address.';
    } else if (errorMessage.includes('auth/weak-password')) {
      this._error = 'Password is too weak. Please use a stronger password.';
    } else if (errorMessage.includes('auth/missing-email')) {
      this._error = 'Email is required.';
    } else {
      this._error = `An unknown error occurred: ${errorMessage}`;
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('user', this._user);
  }

  private loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('user');
    if (savedData) {
      this._user = savedData;
      this._isAuthenticated = true;
    }
  }

  private removeFromLocalStorage(): void {
    localStorage.removeItem('user');
  }
}

export default UserStore;
