import { Component, Input } from '@angular/core';
import { Member } from '../models/member';
import { NgIf } from '@angular/common';
import { DiscussionAddComponent } from '../discussion-add/discussion-add.component';
import { DiscussionListComponent } from '../discussion-list/discussion-list.component';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [NgIf, DiscussionAddComponent, DiscussionListComponent],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.css'
})
export class MemberDetailsComponent {
  @Input() member!: Member;

  constructor(private teamService: TeamService) {}

  onAddDiscussion(text: string) {
    this.teamService.addDiscussion(this.member, text);
  }

  onDeleteDiscussion(id: number) {
    this.teamService.deleteDiscussion(this.member, id);
  }
}
