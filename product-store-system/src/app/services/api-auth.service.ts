import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  private baseUrl: string = `${environment.baseURL}/Auth`;
  isSignalrMode: boolean = false;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, password });
  }

  // logout(): void {
  //   localStorage.removeItem('token');
  // }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // isAuthenticated(): boolean {
  //   return !!this.getToken();
  // }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role']; // Assuming the JWT contains a 'role' claim
  }

}
