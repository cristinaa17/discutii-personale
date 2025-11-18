import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-discussion-add',
  standalone: true,
  imports: [FormsModule],
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
