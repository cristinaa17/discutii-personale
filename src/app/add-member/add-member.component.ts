import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Member } from '../models/member';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent {

  @Output() save = new EventEmitter<Member>();
  @Output() cancel = new EventEmitter<void>();

  form: Partial<Member> = {
    discussions: []
  };

  submitForm() {
    if (!this.form.nume || !this.form.perNr) {
      alert("Numele și PerNR sunt obligatorii");
      return;
    }

    const member: Member = {
      ...this.form as Member,
      discussions: [],
      photoUrl: ''
    };

    this.save.emit(member);
  }
}
