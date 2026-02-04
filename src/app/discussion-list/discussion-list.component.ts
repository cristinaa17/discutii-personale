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
import { FormsModule } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
    selector: 'app-discussion-list',
    imports: [CommonModule, AngularEditorModule, FormsModule, MatListModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
    templateUrl: './discussion-list.component.html',
    styleUrls: ['./discussion-list.component.css']
})
export class DiscussionListComponent {

  @Input() discussions: Discussion[] = [];
  @Output() delete = new EventEmitter<number>();
   @Output() update = new EventEmitter<{ id: number; text: string }>();

  editingId: number | null = null;
  editText: string = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    placeholder: 'Editează discuția...',
    translate: 'no',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo', 'toggleEditorMode']
    ]
  };

  startEdit(d: Discussion) {
    this.editingId = d.id;
    this.editText = d.text; 
  }

  cancelEdit() {
    this.editingId = null;
    this.editText = '';
  }

  saveEdit(d: Discussion) {
    this.update.emit({ id: d.id, text: this.editText });
    this.editingId = null;
  }
}
