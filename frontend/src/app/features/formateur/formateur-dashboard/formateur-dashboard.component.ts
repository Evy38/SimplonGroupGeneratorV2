// src/app/features/formateur/formateur-dashboard/formateur-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formateur-dashboard.component.html',
  styleUrl: './formateur-dashboard.component.css'
})
export class FormateurDashboardComponent implements OnInit {
  userName: string = 'Formateur'; // Valeur par défaut

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;

    if (currentUser?.firstname && currentUser?.lastname) {
      this.userName = `${currentUser.firstname} ${currentUser.lastname}`;
    }
  }
}
