// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  /** 🔐 Connexion */
  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  /** 🆕 Inscription */
  register(userData: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /** ✏️ Mise à jour du profil utilisateur */
  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(updatedUser => {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  /** 🗑️ Suppression du compte utilisateur */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** 🚪 Déconnexion */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  /** 👁️ Vérifie si un utilisateur est connecté */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** 🔎 Retourne le rôle de l’utilisateur courant */
  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  /** 👤 Récupérer l'utilisateur connecté */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** 🛡️ Headers JWT pour les requêtes sécurisées */
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
