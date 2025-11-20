import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { TeamService } from '../team.service';
import { NgFor, NgIf } from '@angular/common';
import { AddMemberComponent } from '../add-member/add-member.component';
import { MemberDetailsComponent } from '../member-details/member-details.component';
import { EditMemberComponent } from "../edit-member/edit-member.component";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [NgIf, NgFor, AddMemberComponent, MemberDetailsComponent, EditMemberComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  members: Member[] =[];
  selectedMember: Member | null = null;
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

  selectMember(member: Member) {
  console.log("Ai selectat:", member);
  this.selectedMember = member;
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

  this.selectedMember = null;
  this.editTarget = member;
  this.showEditForm = true;
}

onSaveEdit(updated: Member) {
  Object.assign(this.editTarget!, updated);
  this.showEditForm = false;
  this.editTarget = null;
}

onCancelEdit() {
  this.showEditForm = false;
  this.editTarget = null;
}

onAddDiscussionFromTable(member: Member, event: Event) {
  event.stopPropagation(); 
  this.selectedMember = member;
  setTimeout(() => {
    const el = document.getElementById('discussion-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 10);
}

}
