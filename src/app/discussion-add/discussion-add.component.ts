import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider'; 
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
    selector: 'app-discussion-add',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, AngularEditorModule],
    templateUrl: './discussion-add.component.html',
    styleUrls: ['./discussion-add.component.css']
})

export class DiscussionAddComponent {
  
  @Output() add = new EventEmitter<string>();

  text: string = "";

  editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '200px',
  placeholder: 'Scrie mesajul...',
  translate: 'no',
  toolbarHiddenButtons: [
    ['insertImage', 'insertVideo', 'toggleEditorMode']
  ]
};


  submit() {
     const plainText = this.text.replace(/<[^>]*>/g, '').trim();

  if (!plainText) return;

  this.add.emit(this.text);
  this.text = '';
  }
}
