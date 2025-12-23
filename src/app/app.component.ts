import { Component } from '@angular/core';
import { TeamComponent } from './team/team.component';

@Component({
    selector: 'app-root',
    imports: [TeamComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {}
