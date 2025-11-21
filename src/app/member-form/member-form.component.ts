import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Member } from '../models/member';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent {

  @Input() member: Member | null = null;  
  @Output() save = new EventEmitter<Member>();
  @Output() cancel = new EventEmitter<void>();

  form: Member = {} as Member;
  isEditMode = false;

  ngOnInit() {
    if (this.member) {
      this.form = { ...this.member };
      this.isEditMode = true;
    } else {
      this.form = {
        perNr: null as any,
        nume: '',
        dataAngajarii: '',
        email: '',
        dataNasterii: '',
        gen: '',
        oras: '',
        departament: '',
        businessUnit: '',
        norma: null as any,
        fte: null as any,
        formaColaborare: '',
        tipContract: '',
        functie: '',
        dreptConcediu: null as any,
        hrManager: '',
        project: '',
        projectStartDate: '',
        projectEndDate: '',
        client: '',
        projectManager: '',
        german: '',
        english: '',
        gLevel: '',
        skills: '',
        discussions: [],
        photoUrl: ''
      };
    }
  }

  submit() {
    this.save.emit(this.form);
  }
}
