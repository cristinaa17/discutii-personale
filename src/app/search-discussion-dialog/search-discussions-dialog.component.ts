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
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';



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
  private queryChanged = new Subject<string>();


  constructor(
    private dialogRef: MatDialogRef<SearchDiscussionsDialogComponent>,
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public members: Member[],
    
  ) {
    
  this.queryChanged
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(value => {
      this.performSearch(value);
    });
  }

  onQueryChange(value: string) {
  this.queryChanged.next(value);
}

private performSearch(query: string) {
  this.query = query;

  if (!query || query.trim().length < 2) {
    this.results = [];
    this.searched = false;
    return;
  }

  this.searched = true;

  this.teamService.searchDiscussions(query).subscribe(results => {
    this.results = results.map(r => ({
      memberId: r.memberId,
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

highlight(text: string, search: string): string {
  if (!search) return text;

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');

  return text.replace(regex, `<span class="highlight">$1</span>`);
}

  select(r: any) {
    this.dialogRef.close(r);
  }
}
