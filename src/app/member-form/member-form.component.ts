import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Member } from '../models/member';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent {

  @Input() member: Member | null = null;  
  @Output() save = new EventEmitter<Member>();
  @Output() cancel = new EventEmitter<void>();

  form: Member = {} as Member;
  isEditMode = false;

  germanLevels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  englishLevels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  glevels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];


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

  validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

  submit() {
    if (!this.form.nume || this.form.nume.trim().length < 2) {
    alert("Te rog să completezi numele (minim 2 caractere).");
    return;
  }

  if (this.form.email && !this.validateEmail(this.form.email)) {
    alert("Te rog să introduci un email valid.");
    return;
  }

    this.save.emit(this.form);
  }
}
