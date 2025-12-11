import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../models/member';
import { TeamService } from '../team.service';

import { MemberDetailsComponent } from '../member-details/member-details.component';
import { MemberFormComponent } from '../member-form/member-form.component';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { NgIf, NgFor } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
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

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.reloadMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  reloadMembers() {
    this.members = this.teamService.getMembers();
    this.dataSource.data = [...this.members];
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  addMember(member: Member) {
    this.teamService.addMember(member);
    this.showAddForm = false;
    this.reloadMembers();
  }

  selectMember(member: Member) {
    if (this.showEditForm) return;

    this.selectedMember =
      this.selectedMember === member ? null : member;
  }

  onDeleteMember(member: Member, event: Event) {
    event.stopPropagation();

    if (!confirm("Sigur dorești să ștergi colegul?")) return;

    const index = this.members.indexOf(member);
    this.teamService.deleteMember(index);

    this.selectedMember = null;
    this.reloadMembers();
  }

  onEditMember(member: Member, event: Event) {
    event.stopPropagation();
    this.editTarget = { ...member };
    this.selectedMember = member;
    this.showEditForm = true;
  }

  onSaveEdit(updated: Member) {
    Object.assign(this.selectedMember!, updated);
    this.showEditForm = false;
    this.editTarget = null;
    this.selectedMember = null;
    this.reloadMembers();
  }

  onCancelEdit() {
    this.showEditForm = false;
    this.editTarget = null;
    this.selectedMember = null;
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
