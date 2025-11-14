import { Injectable } from '@angular/core';
import { Member } from './models/member';
import { Discussion } from './models/discussion';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private members: Member[] = [];
  private discussionId = 1;

  constructor() { }

  getMembers(): Member[] {
    return this.members;
  }

  addMember(member: Member) {
    this.members.push(member);
  }

  editMember(index: number, updated: Member) {
    this.members[index] = updated;
  }

  deleteMember(index: number) {
    this.members.splice(index, 1);
  }

  addDiscussion(member: Member, text: string) {
    const newDiscussion: Discussion = {
      id: this.discussionId++,
      text,
      date: new Date()
    };

    member.discussions.push(newDiscussion);
  }

  deleteDiscussion(member: Member, discId: number) {
    member.discussions = member.discussions.filter(d => d.id !== discId);
  }

  setPhoto(member: Member, url: string) {
    member.photoUrl = url;
  }
}
