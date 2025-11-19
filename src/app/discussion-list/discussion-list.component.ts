import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Discussion } from '../models/discussion';

@Component({
  selector: 'app-discussion-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discussion-list.component.html',
  styleUrls: ['./discussion-list.component.css']
})
export class DiscussionListComponent {

  @Input() discussions: Discussion[] = [];
  @Output() delete = new EventEmitter<number>();

}
