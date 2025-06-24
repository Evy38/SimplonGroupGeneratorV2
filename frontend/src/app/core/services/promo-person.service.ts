import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromoPerson } from './models/promo-person.model';

@Injectable({
  providedIn: 'root'
})
export class PromoPersonService {
  private readonly apiUrl = 'http://localhost:3000/api/promo-people';

  constructor(private http: HttpClient) {}

  getPeopleByPromoId(promoId: number): Observable<PromoPerson[]> {
    return this.http.get<PromoPerson[]>(`${this.apiUrl}/promo/${promoId}`);
  }

  addPersonToPromo(data: { promoId: number; personId: number }): Observable<PromoPerson> {
    return this.http.post<PromoPerson>(this.apiUrl, data);
  }

  removePersonFromPromo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
