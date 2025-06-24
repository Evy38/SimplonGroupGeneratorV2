import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../../core/services/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly apiUrl = 'http://localhost:3000/api/people';

  constructor(private readonly http: HttpClient) {}

  /** 🔁 Récupère toutes les personnes d'une liste donnée */
  getAllPeopleByList(listId: number): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/list/${listId}`);
  }

  /** 🔍 Récupère une personne par son ID */
  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  /** ➕ Crée une nouvelle personne */
  createPerson(data: Partial<Person>): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, data);
  }

  /** ✏️ Met à jour une personne existante */
  updatePerson(id: number, data: Partial<Person>): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, data);
  }

  /** ❌ Supprime une personne */
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
