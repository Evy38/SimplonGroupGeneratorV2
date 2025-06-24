import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupPeople } from './models/group-poeple.model';

@Injectable({
  providedIn: 'root'
})
export class GroupPeopleService {
  private readonly apiUrl = 'http://localhost:3000/api/group-people';

  constructor(private http: HttpClient) {}

  getPeopleByGroupId(groupId: number): Observable<GroupPeople[]> {
    return this.http.get<GroupPeople[]>(`${this.apiUrl}/group/${groupId}`);
  }

  addPersonToGroup(data: { groupId: number; personId: number }): Observable<GroupPeople> {
    return this.http.post<GroupPeople>(this.apiUrl, data);
  }

  removePersonFromGroup(groupPersonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupPersonId}`);
  }
}
