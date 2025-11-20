import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Member } from '../models/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-member',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent {

  @Input() member!: Member;           
  @Output() save = new EventEmitter<Member>();  
  @Output() cancel = new EventEmitter<void>();   

  form: Member = {} as Member;        

  ngOnInit() {
    this.form = { ...this.member };
  }

  submit() {
    this.save.emit(this.form);
  }
}
