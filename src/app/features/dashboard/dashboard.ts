import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  // Mock data to demonstrate the modern @for loop
  projects = [
    { id: 1, name: 'My Project', description: 'No description yet.', date: 'Aug 01, 2026' },
    { id: 2, name: 'Quantum Qubits Experiment', description: 'Simulating qubit entanglement in noisy environments.', date: 'July 15, 2026' },
    { id: 3, name: 'Deciphering Sumerian Tablets', description: 'Translating newly discovered cuneiform texts.', date: 'Jun 28, 2026' }
  ];
}
