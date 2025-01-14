import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { auth } from '@/configs/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateEmail,
} from 'firebase/auth';

type PrivateFields = '_loading' | '_error' | '_uid' | '_user' | '_isAuthenticated';

class UserStore {
  private _user: string = '';
  private _uid: string = '';
  private _loading: boolean = false;
  private _error: string | null = null;
  private _isAuthenticated: boolean = false;

  constructor() {
    makeObservable<UserStore, PrivateFields>(this, {
      _isAuthenticated: observable,
      _user: observable,
      _uid: observable,
      _error: observable,
      _loading: observable,
      isAuthenticated: computed,
      error: computed,
      user: computed,
      uid: computed,
      loading: computed,
      setError: action.bound,
      setLoading: action.bound,
      setUser: action.bound,
      setUid: action.bound,
      setAuthenticated: action.bound,
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

  get uid() {
    return this._uid;
  }

  get loading() {
    return this._loading;
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  setError(msg: string | null) {
    this._error = msg;
  }

  setLoading(isLoading: boolean) {
    this._loading = isLoading;
  }

  setUser(user: string) {
    this._user = user;
  }

  setUid(uid: string) {
    this._uid = uid;
  }

  setAuthenticated(isAuthenticated: boolean) {
    this._isAuthenticated = isAuthenticated;
  }

  async signUp(email: string, password: string): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      runInAction(() => {
        this.setAuthenticated(true);
        this.setUser(email);
        this.setUid(user.user.uid);
      });

      this.saveToLocalStorage();
    } catch (err) {
      if (err instanceof Error) {
        runInAction(() => this.handleFirebaseError(err));
      }
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      runInAction(() => {
        this.setAuthenticated(true);
        this.setUser(email);
        this.setUid(user.user.uid);
      });

      this.saveToLocalStorage();
    } catch (err) {
      if (err instanceof Error) {
        runInAction(() => this.handleFirebaseError(err));
      }
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  async updateEmail(newEmail: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateEmail(user, newEmail);
        runInAction(() => {
          this.setUser(newEmail);
        });
        this.saveToLocalStorage();
      }
    } catch (err) {
      if (err instanceof Error) {
        runInAction(() => this.handleFirebaseError(err));
      }
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
      }
    } catch (err) {
      if (err instanceof Error) {
        runInAction(() => this.handleFirebaseError(err));
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      runInAction(() => {
        this.setAuthenticated(false);
        this.setUser('');
        this.setUid('');
      });
      this.removeFromLocalStorage();
    } catch (err) {
      if (err instanceof Error) {
        runInAction(() => this.setError(`Logout failed: ${err.message}`));
      }
    }
  }

  private handleFirebaseError(err: Error): void {
    const errorMessage = err.message;

    if (errorMessage.includes('auth/invalid-credential')) {
      this.setError('The provided credentials are invalid.');
    } else if (errorMessage.includes('auth/email-already-in-use')) {
      this.setError('This email is already in use.');
    } else if (errorMessage.includes('auth/invalid-email')) {
      this.setError('The email address is not valid.');
    } else if (errorMessage.includes('auth/wrong-password')) {
      this.setError('Incorrect password.');
    } else if (errorMessage.includes('auth/user-not-found')) {
      this.setError('No user found with this email address.');
    } else if (errorMessage.includes('auth/weak-password')) {
      this.setError('Password is too weak.');
    } else if (errorMessage.includes('auth/missing-email')) {
      this.setError('Email is required.');
    } else {
      this.setError(`An unknown error occurred: ${errorMessage}`);
    }
  }

  private saveToLocalStorage(): void {
    const data = {
      user: this._user,
      uid: this._uid,
    };
    localStorage.setItem('userItem', JSON.stringify(data));
  }

  private loadFromLocalStorage(): void {
    const userData = localStorage.getItem('userItem');
    const savedData = userData && JSON.parse(userData);
    if (savedData) {
      this.setUser(savedData.user);
      this.setUid(savedData.uid);
      this.setAuthenticated(true);
    }
  }

  private removeFromLocalStorage(): void {
    localStorage.removeItem('userItem');
    localStorage.removeItem('token');
  }
}

export default UserStore;
