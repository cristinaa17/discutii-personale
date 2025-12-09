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
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    NgIf, NgFor,
    MatTableModule, MatCardModule, MatButtonModule,
    MemberDetailsComponent, MemberFormComponent,
    MatIcon
],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit {

  members: Member[] = [];
  dataSource = new MatTableDataSource<Member>();

  displayedColumns = ['perNr', 'nume', 'email', 'actions'];

  selectedIndex: number | null = null;
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
    this.dataSource.data = this.members;
  }

  addMember(member: Member) {
    this.teamService.addMember(member);
    this.showAddForm = false;
    this.reloadMembers();
  }

  selectMember(m: Member, index: number) {
    if (this.showEditForm) return;

    this.selectedIndex = this.selectedIndex === index ? null : index;
    this.selectedMember = this.selectedIndex !== null ? m : null;
  }

  onDeleteMember(member: Member, event: Event) {
    event.stopPropagation();

    if (!confirm("Sigur dorești să ștergi colegul?")) return;

    const index = this.members.indexOf(member);
    this.teamService.deleteMember(index);

    this.selectedIndex = null;
    this.selectedMember = null;

    this.reloadMembers();
  }

  onEditMember(member: Member, event: Event) {
    event.stopPropagation();
    this.editTarget = member;
    this.showEditForm = true;
  }

  onSaveEdit(updated: Member) {
    Object.assign(this.editTarget!, updated);
    this.showEditForm = false;
    this.editTarget = null;
    this.reloadMembers();
  }

  onCancelEdit() {
    this.showEditForm = false;
    this.editTarget = null;
  }

  onAddDiscussionFromTable(member: Member, event: Event) {
    event.stopPropagation();
    this.selectedMember = member;
    this.selectedIndex = this.members.indexOf(member);

    setTimeout(() => {
      const el = document.getElementById('discussion-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }
}
