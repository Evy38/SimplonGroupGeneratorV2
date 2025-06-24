import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brief } from '../../core/services/models/brief.model';

@Injectable({
  providedIn: 'root'
})
export class BriefService {
  private readonly apiUrl = 'http://localhost:3000/api/briefs';

  constructor(private readonly http: HttpClient) {}

  /** 🔁 Récupère tous les briefs */
  getAllBriefs(): Observable<Brief[]> {
    return this.http.get<Brief[]>(this.apiUrl);
  }

  /** 🔍 Récupère un brief spécifique par son ID */
  getBriefById(id: string): Observable<Brief> {
    return this.http.get<Brief>(`${this.apiUrl}/${id}`);
  }

  /** 🔍 Récupère tous les briefs d'une promo */
  getBriefsByPromoId(promoId: string): Observable<Brief[]> {
    return this.http.get<Brief[]>(`${this.apiUrl}/promo/${promoId}`);
  }

  /** ➕ Crée un nouveau brief */
  createBrief(data: Partial<Brief>): Observable<Brief> {
    return this.http.post<Brief>(this.apiUrl, data);
  }

  /** ✏️ Met à jour un brief existant */
  updateBrief(id: string, data: Partial<Brief>): Observable<Brief> {
    return this.http.put<Brief>(`${this.apiUrl}/${id}`, data);
  }

  /** ❌ Supprime un brief */
  deleteBrief(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** 👤 Récupère les briefs de l'utilisateur connecté */
  getBriefsByMe(): Observable<Brief[]> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<Brief[]>(`${this.apiUrl}/me`, { headers });
  }

  /** 👥 Récupère les groupes associés à un brief */
  getGroupsForBrief(briefId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/${briefId}/groups`, { headers });
  }
}
