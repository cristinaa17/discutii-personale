import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { TeamService } from '../team.service';
import { NgFor, NgIf } from '@angular/common';
import { AddMemberComponent } from '../add-member/add-member.component';
import { MemberDetailsComponent } from '../member-details/member-details.component';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [NgIf, NgFor, AddMemberComponent, MemberDetailsComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  members: Member[] =[];
  selectedMember: Member | null = null;
  showAddForm = false;

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

}
