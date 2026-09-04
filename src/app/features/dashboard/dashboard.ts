import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCreate } from '../projects/project-create/project-create';
import { ProjectList } from '../projects/project-list/project-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectCreate, ProjectList],
  templateUrl: './dashboard.html',
})
export class Dashboard {}