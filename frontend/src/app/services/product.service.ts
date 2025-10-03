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
export class ProductService {
  private baseUrl = environment.apiUrl + "/api/products";

  private http: HttpClient = inject(HttpClient);
  private errorHandler: ErrorHandlerService = inject(ErrorHandlerService);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  findAll() {
    let url = `${this.baseUrl}/`;

    return this.http.get<any>(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }
}
