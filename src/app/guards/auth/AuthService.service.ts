import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from './interface/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { AuthResponse } from './interface/auth.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

const baseURL = environment.baseURL;
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => {
      return this.checkStatus();
    },
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() == 'checking') {
      return 'checking';
    }

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  isAdmin = computed( () => this._user()?.roles.includes('admin') ?? false) 

  login(email: string, password: string):Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseURL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((res) => {
          return this.handleLoginSucces(res);
        }),

        catchError((error: any) => {
          console.log("error");
          
          return this.handleLoginError(error);
        })
      );
  }

  checkStatus():Observable<boolean> {
    const token = localStorage.getItem('token');
    console.log(token);
    
    if (!token) {      
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseURL}/auth/check-status`, {
        
      })
      .pipe(
        map((res) => {        
          return this.handleLoginSucces(res);
        }),
        catchError((error: any) => {
          console.log("Not authenticated error", error);

          return this.handleLoginError(error);
        })
      );
  }


  register(email: string, password: string, fullName:string){
    return this.http
      .post<AuthResponse>(`${baseURL}/auth/register`, {
        email,
        password,
        fullName
      })
      .pipe(
        map((res) => {
          return this.handleLoginSucces(res);
        }),

        catchError((error: any) => {
          console.log("error in register");
          
          return this.handleLoginError(error);
        })
      );


  }


  logout() {
    this._authStatus.set('not-authenticated');
    this._token.set(null);
    this._user.set(null);

    localStorage.removeItem('token');
    return false;
  }

  private handleLoginSucces(res: AuthResponse): boolean {
    this._user.set(res.user);
    this._token.set(res.token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', res.token);
    return true;
  }

  private handleLoginError(res: any) {
    this.logout();
    return of(false);
  }
}
