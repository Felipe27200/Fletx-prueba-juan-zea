import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Login } from '../interfaces/Login';
import { catchError, map, Observable, tap } from 'rxjs';
import { CreateUser } from '../interfaces/CreateUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + "/api/auth";
  private accessToken: string | null = null;

  private http: HttpClient = inject(HttpClient);
  private errorHandler: ErrorHandlerService = inject(ErrorHandlerService);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor() { }

  login(formData: Login) {
    let url = `${this.baseUrl}/login`;

    return this.http.post<any>(url, formData, this.httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  signUp(formData: CreateUser) {
    let url = `${this.baseUrl}/register`;

    return this.http.post<any>(url, formData, this.httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  refreshAccessToken(): Observable<string> {
    return this.http.get<{ accessToken: string }>(
      `${environment.apiUrl}/api/auth/refresh-token`,
      { withCredentials: true }
    ).pipe(
      tap(res => this.accessToken = res.accessToken),
      // map to return only token
      map(res => res.accessToken)
    );
  }
  
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}
