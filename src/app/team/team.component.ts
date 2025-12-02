import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { TeamService } from '../team.service';
import { NgFor, NgIf } from '@angular/common';
import { MemberDetailsComponent } from '../member-details/member-details.component';
import { MemberFormComponent } from "../member-form/member-form.component";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [NgIf, NgFor, MemberDetailsComponent, MemberFormComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  members: Member[] =[];
  selectedMember: Member | null = null;
  selectedIndex: number | null = null;
  showAddForm = false;
  editTarget: Member | null = null;
  showEditForm = false;


  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.members = this.teamService.getMembers();
  }

  addMember(member: Member) {
    this.teamService.addMember(member);
    this.showAddForm = false;
  }

  selectMember(m: Member, index: number) {
    if (this.showEditForm) return;
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  onDeleteMember(index: number, event: Event) {
    event.stopPropagation();

    const confirmDelete = confirm("Ești sigur că vrei să ștergi acest coleg?");
    if (!confirmDelete) return;

    this.teamService.deleteMember(index);

    this.selectedMember = null;
  }

  onEditMember(member: Member, event: Event) {
  event.stopPropagation();

  this.selectedIndex = this.members.indexOf(member);
  this.selectedMember = null;
  this.editTarget = member;
  this.showEditForm = true;
  }

onSaveEdit(updated: Member) {
  Object.assign(this.editTarget!, updated);
  this.showEditForm = false;
  this.editTarget = null;
  this.selectedIndex = null;
  this.selectedMember = null;
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
     if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 150);
}
}
