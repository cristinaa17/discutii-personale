import { Component, Input, NgModule } from '@angular/core';
import { Member } from '../models/member';

import { DiscussionAddComponent } from '../discussion-add/discussion-add.component';
import { DiscussionListComponent } from '../discussion-list/discussion-list.component';
import { TeamService } from '../team.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-member-details',
    standalone: true,
    imports: [FormsModule, DiscussionListComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, DiscussionAddComponent],
    templateUrl: './member-details.component.html',
    styleUrl: './member-details.component.css'
})
export class MemberDetailsComponent {
  @Input() member!: Member;

  constructor(private teamService: TeamService) {}

 ngOnInit() {
  this.loadDiscussions();
}

loadDiscussions() {
  this.teamService
    .getDiscussions(this.member.id!)
    .subscribe(discussions => {
      this.member.discussions = discussions.map(d => ({
        ...d,
        date: new Date(d.date)
      }));
    });
}

  onDiscussionAdded(text: string) {
  const tempDiscussion = {
    id: Date.now(),
    text,
    date: new Date()
  };

  this.member.discussions.unshift(tempDiscussion);

  this.teamService
    .addDiscussion(this.member.id!, text)
    .subscribe(saved => {

      const index = this.member.discussions.indexOf(tempDiscussion);
      this.member.discussions[index].id = saved.id;
      this.member.discussions[index].date = new Date(saved.date);

    });
}

  get initials(): string {
  if (!this.member?.nume) return '';

  const parts = this.member.nume.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase()
  );
}

  onDeleteDiscussion(id: number) {
     this.member.discussions = this.member.discussions.filter(d => d.id !== id);
     this.teamService.deleteDiscussion(id).subscribe();
  }
}
