import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider'; 

@Component({
    selector: 'app-discussion-add',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
    templateUrl: './discussion-add.component.html',
    styleUrls: ['./discussion-add.component.css']
})

export class DiscussionAddComponent {
  
  @Output() add = new EventEmitter<string>();

  text: string = "";

  submit() {
    if (!this.text.trim()) return;
    this.add.emit(this.text.trim());
    this.text = "";
  }
}
