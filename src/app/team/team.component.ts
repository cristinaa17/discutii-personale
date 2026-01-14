import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../models/member';
import { TeamService } from '../team.service';

import { MemberDetailsComponent } from '../member-details/member-details.component';
import { MemberFormComponent } from '../member-form/member-form.component';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';



import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from '@angular/material/dialog';
import { SearchDiscussionsDialogComponent } from '../search-discussion-dialog/search-discussions-dialog.component';
import { MemberPayload } from '../models/member-payload';

@Component({
    selector: 'app-team',
    imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MemberDetailsComponent,
    MemberFormComponent
],
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit {

  members: Member[] = [];
  dataSource = new MatTableDataSource<Member>();

  displayedColumns = ['perNr', 'nume', 'email', 'actions'];

  selectedMember: Member | null = null;

  showAddForm = false;
  showEditForm = false;
  editTarget: Member | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private teamService: TeamService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.reloadMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  reloadMembers() {
  this.teamService.getMembers().subscribe(members => {
    this.members = members.map(m => ({
      ...m,
      discussions: [] // se încarcă separat
    }));

    this.dataSource.data = this.members;
  });
}

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  addMember(member: Member) {
  const payload: MemberPayload = {
    perNr: member.perNr,
    nume: member.nume,
    dataAngajarii: member.dataAngajarii,
    email: member.email,
    dataNasterii: member.dataNasterii,
    gen: member.gen,
    oras: member.oras,
    departament: member.departament,
    businessUnit: member.businessUnit,
    norma: member.norma,
    fte: member.fte,
    formaColaborare: member.formaColaborare,
    tipContract: member.tipContract,
    functie: member.functie,
    dreptConcediu: member.dreptConcediu,
    hrManager: member.hrManager,
    project: member.project,
    projectStartDate: member.projectStartDate,
    projectEndDate: member.projectEndDate,
    client: member.client,
    projectManager: member.projectManager,
    german: member.german,
    english: member.english,
    gLevel: member.gLevel,
    skills: member.skills,
    photoUrl: member.photoUrl
  };

  this.teamService.addMember(payload).subscribe(() => {
    this.showAddForm = false;
    this.reloadMembers();
  });
}

  selectMember(member: Member) {
    if (this.showEditForm) return;

    this.selectedMember =
      this.selectedMember === member ? null : member;
  }

  onDeleteMember(member: Member, event: Event) {
  event.stopPropagation();

  if (!confirm("Sigur dorești să ștergi colegul?")) return;

  this.teamService.deleteMember(member.id!).subscribe(() => {
    this.selectedMember = null;
    this.reloadMembers();
  });
}

  onEditMember(member: Member, event: Event) {
    event.stopPropagation();
    this.editTarget = { ...member };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  openSearchDialog() {
  const dialogRef = this.dialog.open(SearchDiscussionsDialogComponent, {
    width: '500px',
    data: this.members
  });

  dialogRef.afterClosed().subscribe(result => {
  if (!result) return;

  const member = this.members.find(
    m => m.nume === result.member.nume
  );

  if (!member) return;

  this.selectedMember = member;

  setTimeout(() => {
    const el = document.getElementById('discussion-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, 200);
});
}

  onSaveEdit(updated: Member) {
    const { id, discussions, ...payload } = updated;

    this.teamService.updateMember(id!, payload).subscribe(() => {
      this.showEditForm = false;
      this.editTarget = null;
      this.selectedMember = null;

      this.reloadMembers(); // 🔥 cheia
  });
}


  onCancelEdit() {
    this.showEditForm = false;
    this.editTarget = null;
  }

  onCancelAdd() {
    this.showAddForm = false;
  }

  onAddDiscussionFromTable(member: Member, event: Event) {
    event.stopPropagation();
    this.selectedMember = member;

    setTimeout(() => {
      const el = document.getElementById('discussion-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }
}
