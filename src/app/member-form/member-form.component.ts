import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Member } from '../models/member';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent {

  @Input() member: Member | null = null;  
  @Output() save = new EventEmitter<Member>();
  @Output() cancel = new EventEmitter<void>();

  form: Member = {} as Member;
  isEditMode = false;
  previewUrl: string | null = null;
  isDragOver = false;

  germanLevels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  englishLevels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  glevels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];

  ngOnInit() {
    if (this.member) {
      this.form = { ...this.member };
      this.previewUrl = this.member.photoUrl || null;
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

  triggerFileInput() {
    const input = document.querySelector('#fileInput') as HTMLInputElement;
    if (input) input.click();
  }

  validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

 handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Te rog să încarci o imagine.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.form.photoUrl = this.previewUrl!;
    };
    reader.readAsDataURL(file);
  } 

  onPhotoSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrl = reader.result as string;
    this.form.photoUrl = this.previewUrl;
  };
  reader.readAsDataURL(file);
}

  triggerPhotoUpload() {
    const fileInput = document.getElementById('photoUploadInput') as HTMLInputElement;
    fileInput.click();
  }

  get initials(): string {
  if (!this.form?.nume) return '';

  const parts = this.form.nume.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase()
  );
}


  removePhoto() {
    this.previewUrl = null;
    this.form.photoUrl = '';
  }


  submit() {
    if (!this.form.nume) {
    alert("Te rog să completezi numele.");
    return;
    }

  if (this.form.email && !this.validateEmail(this.form.email)) {
    alert("Te rog să introduci un email valid.");
    return;
  }

    this.save.emit(this.form);
  }
}
