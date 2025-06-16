import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface List {
  id: number;
  nom: string;
  user_id: number;
  est_partagee?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly apiUrl = 'http://localhost:3000/lists';

  constructor(private readonly http: HttpClient) {}

  // Récupérer toutes les listes
  getAllLists(): Observable<List[]> {
    return this.http.get<List[]>(this.apiUrl);
  }

  // Créer une nouvelle liste
  createList(list: Partial<List>): Observable<List> {
    return this.http.post<List>(this.apiUrl, list);
  }
  
}
