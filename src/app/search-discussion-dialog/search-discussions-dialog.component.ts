import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { Member } from '../models/member';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './search-discussions-dialog.component.html',
  styleUrls: ['./search-discussions-dialog.component.css'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    NgIf,
    NgFor,
    MatDialogContent
]
})
export class SearchDiscussionsDialogComponent {

  query = '';
  results: any[] = [];
  searched = false;

  constructor(
    private dialogRef: MatDialogRef<SearchDiscussionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public members: Member[]
  ) {}

  search() {
    this.searched = true;
    this.results = [];

    const q = this.query.toLowerCase();

    this.members.forEach(member => {
      member.discussions?.forEach(discussion => {
        if (discussion.text.toLowerCase().includes(q)) {
          this.results.push({ member, discussion });
        }
      });
    });
  }

  select(result: any) {
    this.dialogRef.close(result.member);
  }
}
