import { Injectable } from '@angular/core';
import { Member } from './models/member';
import { Discussion } from './models/discussion';
import { HttpClient } from '@angular/common/http';
import { MemberPayload } from './models/member-payload';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private api = '/api';

  constructor(private http: HttpClient) {}

  getMembers(includeDeleted: boolean = false, hasFollowup: boolean = false) {
    const params: string[] = [];
    if (includeDeleted) params.push('includeDeleted');
    if (hasFollowup) params.push('hasFollowup');

    const suffix = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Member[]>(`${this.api}/members${suffix}`);
  }

  addMember(member: MemberPayload) {
    return this.http.post(`${this.api}/members`, member);
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

  updateDiscussionFollowUp(id: number, hasFollowUp: boolean) {
    return this.http.put(`${this.api}/discussions/${id}/followup`, { hasFollowUp: hasFollowUp ? 1 : 0 });
  }

  importDiscussionsExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.api}/import/discussions`, formData);
  }

  getFollowUpCount() {
    return this.http.get<{ count: number }>(`${this.api}/discussions/followup/count`);
  }

  restoreMember(id: number) {
    return this.http.put(`${this.api}/members/${id}/restore`, {});
  }
}
