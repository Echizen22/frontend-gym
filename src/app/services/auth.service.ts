import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  private readonly baseUrl: string = environment.baseUrl;
  private readonly http: HttpClient = inject(HttpClient);
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly router = inject(Router);

  private _authStatus = signal({ isLoggedIn: this.isLoggedIn(), isAdmin: this.isAdmin() });

  get authStatus() {
    return this._authStatus.asReadonly();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ nombre, token }) => {
        this.setAuthentication(nombre, token);
        return true
      })
    )
  }

  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;


    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        ...payload
      }
    } catch (error) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      return payload.exp > now; // ❗ Aquí sí lo usas
    } catch (e) {
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin === true;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.cookieService.delete(this.tokenKey, '/');
    this._authStatus.set({ isLoggedIn: false, isAdmin: false });
    this.router.navigateByUrl('/login');
  }

  setAuthentication(name: string, token: string): void {
    // Guarda el token en cookie
    this.cookieService.set('token', token, {
      path: '/',
      sameSite: 'Lax',
      secure: false // cambia a true si usas HTTPS
    });

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this._authStatus.set({
        isLoggedIn: true,
        isAdmin: payload.isAdmin === true
      });
    } catch {
      this._authStatus.set({ isLoggedIn: false, isAdmin: false });
    }

  }


}
