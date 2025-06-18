// src/app/core/services/promo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Promo } from '../services/models/promo.model';
import { Person } from '../../core/services/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  private readonly apiUrl = 'http://localhost:3000/api/promos';
  private readonly promosSubject = new BehaviorSubject<Promo[]>([]);  // ✅ le sujet interne
  public readonly promos$ = this.promosSubject.asObservable(); 
  constructor(private readonly http: HttpClient) {
     this.promosSubject.next([
      {
        id: 'demo-promo',
        nom: 'Démo',
        imageUrl: '',
        formateurName: 'Formateur Démo',
        members: []
      }
    ]);
  }

  /** 🔁 Récupère toutes les promos depuis le backend */
  getAllPromos(): Observable<Promo[]> {
    return this.http.get<Promo[]>(this.apiUrl);
  }

  /** 🔍 Récupère les membres d’une promo par son ID */
  getMembersByPromoId(promoId: string | number): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/${promoId}/people`);
  }

  /** 🔍 Récupère une promo spécifique */
  getPromoById(id: string | number): Observable<Promo> {
    return this.http.get<Promo>(`${this.apiUrl}/${id}`);
  }

  /** ➕ Crée une promo */
  createPromo(promoData: Omit<Promo, 'id'>): Observable<Promo> {
    return this.http.post<Promo>(this.apiUrl, promoData);
  }

  /** ✏️ Met à jour une promo */
  updatePromo(id: string | number, promoData: Partial<Promo>): Observable<Promo> {
    return this.http.put<Promo>(`${this.apiUrl}/${id}`, promoData);
  }

  /** ❌ Supprime une promo */
  deletePromo(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
