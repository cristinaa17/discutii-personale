import { Component, Input } from '@angular/core';
import { Member } from '../models/member';
import { NgIf } from '@angular/common';
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

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [NgIf, DiscussionAddComponent, DiscussionListComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
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
