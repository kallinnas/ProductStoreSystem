import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserRegistrDto } from '../models/user.model';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  private baseUrl: string = `${environment.baseURL}/Auth`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticatedSubject$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private signalrService: SignalrService,
  ) { }

  login(email: string, password: string): Observable<any> {
    //Temp solution to let work signalr logout because logout-api doesnt exist auth.service.53
    this.signalrService.userData.id = email; this.signalrService.userData.name = password;

    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  register(user: UserRegistrDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  private validateToken(token: string): void {
    this.http.post<boolean>(`${this.baseUrl}/validateToken`, { token })
      .pipe(
        map((isValid) => {
          this.isAuthenticatedSubject.next(isValid);
        }),
        catchError(() => {
          this.isAuthenticatedSubject.next(false);
          return of(false);
        })
      ).subscribe();
  }

  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.validateToken(token);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role'];
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['nameid']; // 'nameid' corresponds to ClaimTypes.NameIdentifier
  }

}
