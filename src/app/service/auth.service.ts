import { Injectable } from '@angular/core';
import { LoginResponseDTO } from '../dto/loginResponse.dto';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from "jwt-decode"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();
  private userId: string | null = null;

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getValidToken();
    this._isLoggedIn.next(!!token);
  }

  setSession(authResult: LoginResponseDTO): void {
    console.log(authResult)
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('userId', authResult.userId);
    localStorage.setItem('username', authResult.username);
    localStorage.setItem('userRole', authResult.role);
    localStorage.setItem('roleId',authResult.roleId)
    this._isLoggedIn.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!this.getValidToken();
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('roleId');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat as expired if there's an error
    }
  }

  getValidToken(): string | null {
    if (this.isTokenExpired()) {
      this.logout(); // Logout if token is expired
      return null;
    }
    return this.getToken();
  }
}
