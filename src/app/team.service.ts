import { Injectable } from '@angular/core';
import { Member } from './models/member';
import { Discussion } from './models/discussion';
import { HttpClient } from '@angular/common/http';
import { MemberPayload } from './models/member-payload';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getMembers(showAll: boolean = false) {
  return this.http.get<Member[]>(
    `http://localhost:3000/api/members?showAll=${showAll}`
  );
}

  addMember(member: MemberPayload) {
    return this.http.post('http://localhost:3000/api/members', member);
  }

  updateMember(id: number, payload: any) {
    return this.http.put(`${this.api}/members/${id}`, payload);
  }

  deleteMember(id: number) {
    return this.http.delete(`${this.api}/members/${id}`);
  }

  getDiscussions(memberId: number) {
    return this.http.get<Discussion[]>(`${this.api}/discussions/${memberId}`);
  }

  addDiscussion(memberId: number, text: string) {
    return this.http.post<Discussion>(`${this.api}/discussions`, {
      memberId,
      text,
    });
  }

  searchDiscussions(query: string) {
    return this.http.get<any[]>(
      `${this.api}/discussions/search?q=${encodeURIComponent(query)}`,
    );
  }

  deleteDiscussion(id: number) {
    return this.http.delete(`${this.api}/discussions/${id}`);
  }

  updateDiscussion(id: number, text: string) {
    return this.http.put(`${this.api}/discussions/${id}`, { text });
  }

  importDiscussionsExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      'http://localhost:3000/api/import/discussions',
      formData,
    );
  }
}
