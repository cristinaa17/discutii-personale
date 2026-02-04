import { Component, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
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
export class MemberDetailsComponent implements OnChanges{
  @Input() member!: Member;
  @Input() scrollToDiscussionId: number | null = null;

  constructor(private teamService: TeamService) {}

 ngOnInit() {
  this.loadDiscussions();
}

ngOnChanges(changes: SimpleChanges) {
  if (changes['scrollToDiscussionId'] && this.scrollToDiscussionId) {
    setTimeout(() => {
      const el = document.getElementById(
        'discussion-' + this.scrollToDiscussionId
      );
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
}

loadDiscussions() {
  this.teamService
    .getDiscussions(this.member.id!)
    .subscribe(discussions => {
      this.member.discussions = discussions.map(d => ({
        ...d,
        date: new Date(d.date)
      }));

      if (this.scrollToDiscussionId) {
        setTimeout(() => {
          const el = document.getElementById(
            'discussion-' + this.scrollToDiscussionId
          );
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.scrollToDiscussionId = null;
        }, 100);
      }
    });
}

 onDiscussionAdded(text: string) {
  this.teamService
    .addDiscussion(this.member.id!, text)
    .subscribe(() => {
      this.loadDiscussions(); 
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

  onUpdateDiscussion(e: {id:number, text:string}) {
  const d = this.member.discussions.find(x => x.id === e.id);
  if (!d) return;

  d.text = e.text;

  this.teamService.updateDiscussion(e.id, e.text).subscribe();
}
}
