import { Component, Input } from '@angular/core';
import { Member } from '../models/member';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [NgIf],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.css'
})
export class MemberDetailsComponent {
  @Input() member!: Member;
}
