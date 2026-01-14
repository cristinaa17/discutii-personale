import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { Member } from '../models/member';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from "@angular/material/icon";
import { TeamService } from '../team.service';



@Component({
    templateUrl: './search-discussions-dialog.component.html',
    styleUrls: ['./search-discussions-dialog.component.css'],
    imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDialogContent,
    MatIcon
]
})
export class SearchDiscussionsDialogComponent {

  query = '';
  results: any[] = [];
  searched = false;

  constructor(
    private dialogRef: MatDialogRef<SearchDiscussionsDialogComponent>,
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public members: Member[],
    
  ) {}

  search() {
  this.searched = true;

  this.teamService.searchDiscussions(this.query)
  .subscribe(results => {
    this.results = results.map(r => ({
  member: {
    nume: r.nume
  },
  discussion: {
    id: r.id,
    text: r.text,
    date: new Date(r.date)
  }
}));

  });

}

  select(r: any) {
    this.dialogRef.close(r);
  }
}
