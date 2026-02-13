import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Member } from '../models/member';
import { TeamService } from '../team.service';

import { MemberDetailsComponent } from '../member-details/member-details.component';
import { MemberFormComponent } from '../member-form/member-form.component';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { SearchDiscussionsDialogComponent } from '../search-discussion-dialog/search-discussions-dialog.component';
import { MemberPayload } from '../models/member-payload';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-team',
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MemberDetailsComponent,
    MemberFormComponent,
  ],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit, AfterViewInit {
  members: Member[] = [];
  dataSource = new MatTableDataSource<Member>();

  displayedColumns = ['perNr', 'nume', 'email', 'actions'];

  selectedMember: Member | null = null;
  selectedDiscussionId: number | null = null;
  scrollToDiscussionId: number | null = null;

  showAddForm = false;
  showEditForm = false;
  editTarget: Member | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.reloadMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  reloadMembers() {
    this.teamService.getMembers().subscribe((members) => {
      this.members = members.map((m) => ({
        ...m,
        discussions: [],
      }));

      this.dataSource.data = this.members;
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  addMember(member: Member) {
    const payload: MemberPayload = {
      perNr: member.perNr,
      nume: member.nume,
      dataAngajarii: member.dataAngajarii,
      email: member.email,
      dataNasterii: member.dataNasterii,
      gen: member.gen,
      oras: member.oras,
      departament: member.departament,
      businessUnit: member.businessUnit,
      norma: member.norma,
      fte: member.fte,
      formaColaborare: member.formaColaborare,
      tipContract: member.tipContract,
      functie: member.functie,
      dreptConcediu: member.dreptConcediu,
      hrManager: member.hrManager,
      project: member.project,
      projectStartDate: member.projectStartDate,
      projectEndDate: member.projectEndDate,
      client: member.client,
      projectManager: member.projectManager,
      german: member.german,
      english: member.english,
      gLevel: member.gLevel,
      skills: member.skills,
      photoUrl: member.photoUrl,
    };

    this.teamService.addMember(payload).subscribe(() => {
      this.showAddForm = false;
      this.reloadMembers();
    });
  }

  selectMember(member: Member) {
    if (this.showEditForm) return;

    this.selectedMember = this.selectedMember === member ? null : member;
  }

  onDeleteMember(member: Member, event: Event) {
    event.stopPropagation();

    if (!confirm('Sigur dorești să ștergi colegul?')) return;

    this.teamService.deleteMember(member.id!).subscribe(() => {
      this.selectedMember = null;
      this.reloadMembers();
    });
  }

  onEditMember(member: Member, event: Event) {
    event.stopPropagation();
    this.editTarget = { ...member };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  openSearchDialog() {
    const dialogRef = this.dialog.open(SearchDiscussionsDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const member = this.members.find((m) => m.id === result.memberId);

      if (!member) return;

      this.selectedMember = null;
      this.scrollToDiscussionId = null;

      setTimeout(() => {
        this.selectedMember = member;
        this.scrollToDiscussionId = result.discussion.id;
      });
    });
  }

  onSaveEdit(updated: Member) {
    const { id, discussions, ...payload } = updated;

    this.teamService.updateMember(id!, payload).subscribe(() => {
      this.showEditForm = false;
      this.editTarget = null;
      this.selectedMember = null;

      this.reloadMembers();
    });
  }

  onCancelEdit() {
    this.showEditForm = false;
    this.editTarget = null;
  }

  onCancelAdd() {
    this.showAddForm = false;
  }

  onAddDiscussionFromTable(member: Member, event: Event) {
    event.stopPropagation();
    this.selectedMember = member;

    setTimeout(() => {
      const el = document.getElementById('discussion-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }

  handleImported(members: Member[]) {
    members.forEach((m) => this.addMember(m));
  }

  onExcelSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.importFromExcel(file);
  }

  importFromExcel(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      this.teamService.getMembers().subscribe((existingMembers) => {
        const existingPerNrSet = new Set(
          existingMembers.map((m) => m.perNr.toString()),
        );

        let added = 0;
        let skipped = 0;

        rows.forEach((row) => {
          if (!row['PerNr'] || !row['Nume']) {
            skipped++;
            return;
          }

          const perNr = row['PerNr'].toString().trim();

          if (existingPerNrSet.has(perNr)) {
            skipped++;
            return;
          }

          const member: Member = {
            perNr: Number(perNr),
            nume: row['Nume'],
            dataAngajarii: this.parseExcelDate(row['DataAngajarii']) || '',
            email: row['Email'] || '',
            dataNasterii: this.parseExcelDate(row['DataNasterii']) || '',
            gen: row['Gen'] || '',
            oras: row['Oras'] || '',
            departament: row['Departament'] || '',
            businessUnit: row['BusinessUnit'] || '',
            norma: Number(row['Norma']) || 0,
            fte: Number(row['FTE']) || 0,
            formaColaborare: row['FormaColaborare'] || '',
            tipContract: row['TipContract'] || '',
            functie: row['Functie'] || '',
            dreptConcediu: Number(row['DreptConcediu']) || 0,
            hrManager: row['HRManager'] || '',
            project: row['Project'] || '',
            projectStartDate:
              this.parseExcelDate(row['ProjectStartDate']) || '',
            projectEndDate: this.parseExcelDate(row['ProjectEndDate']) || '',
            client: row['Client'] || '',
            projectManager: row['ProjectManager'] || '',
            german: row['German'] || '',
            english: row['English'] || '',
            gLevel: row['G-Level'] || '',
            skills: row['Skills'] || '',
            photoUrl: '',
            discussions: [],
          };

          this.addMember(member);
          existingPerNrSet.add(perNr);
          added++;
        });

        alert(
          `Import angajați finalizat.\nAdăugați: ${added}\nIgnorați: ${skipped}`,
        );
        this.reloadMembers();
      });
    };

    reader.readAsBinaryString(file);
  }

  private normalizeText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  private parseExcelDate(value: any): string {
    if (!value) return '';

    if (typeof value === 'number') {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000));
      return date.toISOString().slice(0, 10);
    }

    if (value instanceof Date && !isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }

    if (typeof value === 'string') {
      const v = value.trim();

      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        return v;
      }

      let m = v.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (m) {
        const [, d, mo, y] = m;
        return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }

      m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) {
        const [, mo, d, y] = m;
        return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }

    return '';
  }

  private parseDiscussionText(value: any): string {
    if (value === null || value === undefined) return '';

    let text = String(value);

    text = text.replace(/\r\n/g, '\n');

    return text;
  }

  reloadMemberDiscussions(member: Member) {
    this.teamService.getDiscussions(member.id!).subscribe((discussions) => {
      member.discussions = discussions.map((d) => ({
        ...d,
        date: new Date(d.date),
      }));
    });
  }

  onDiscussionsExcelSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.teamService.importDiscussionsExcel(file).subscribe((res) => {
      alert(`Import finalizat.
        Discuții adăugate: ${res.added}
        Poze actualizate: ${res.updatedPhotos}`);
      this.reloadMembers();
    });
  }
}
