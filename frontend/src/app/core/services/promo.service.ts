import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promo } from '../services/models/promo.model';
import { Person } from '../../core/services/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  private readonly apiUrl = 'http://localhost:3000/api/promos';

  constructor(private readonly http: HttpClient) {}

  /** 🔁 Récupère toutes les promos avec leur formateur */
  getAllPromos(): Observable<Promo[]> {
    return this.http.get<Promo[]>(this.apiUrl);
  }

  /** 🔍 Récupère une promo spécifique par son ID */
  getPromoById(id: number): Observable<Promo> {
    return this.http.get<Promo>(`${this.apiUrl}/${id}`);
  }

  /** 👥 Récupère les personnes rattachées à une promo */
  getPeopleForPromo(promoId: number): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/${promoId}/people`);
  }

  /** ➕ Crée une nouvelle promo */
  createPromo(promoData: Omit<Promo, 'id'>): Observable<Promo> {
    return this.http.post<Promo>(this.apiUrl, promoData);
  }

  /** ✏️ Met à jour une promo existante */
  updatePromo(id: number, promoData: Partial<Promo>): Observable<Promo> {
    return this.http.put<Promo>(`${this.apiUrl}/${id}`, promoData);
  }

  /** ❌ Supprime une promo */
  deletePromo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
