import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Discussion } from '../models/discussion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-discussion-list',
    imports: [CommonModule, MatListModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
    templateUrl: './discussion-list.component.html',
    styleUrls: ['./discussion-list.component.css']
})
export class DiscussionListComponent {

  @Input() discussions: Discussion[] = [];
  @Output() delete = new EventEmitter<number>();

}
