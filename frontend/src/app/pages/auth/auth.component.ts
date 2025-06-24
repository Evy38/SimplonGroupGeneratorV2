// src/app/pages/auth/auth.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/services/models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  loginError: string | null = null;

  isRegisterModalOpen: boolean = false;
  registrationStep: 'roleSelection' | 'formApprenant' | 'formFormateur' = 'roleSelection';

  registerApprenantData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    genre: '',
    aisance_fr: 0,
    ancien_dwwm: false,
    niveau_tech: 0,
    profil: '',
    age: null as number | null
  };

  registerFormateurData = {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  };

  registerError: string | null = null;
  registerSuccess: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void { }

  /** 🔐 Connexion */
  onLoginSubmit(): void {
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => {
        this.loginError = null;
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.loginError = 'Identifiants invalides.';
      }
    });
  }

  /** 🆕 Inscription Apprenant */
  onRegisterApprenantSubmit(): void {
    const userData = {
      ...this.registerApprenantData,
      role: UserRole.APPRENANT
    };
    this.authService.register(userData).subscribe({
      next: () => {
        this.registerSuccess = 'Inscription réussie, veuillez vérifier votre email.';
        this.registerError = null;
      },
      error: () => {
        this.registerError = 'Erreur lors de l’inscription.';
        this.registerSuccess = null;
      }
    });
  }

  /** 🆕 Inscription Formateur */
  onRegisterFormateurSubmit(): void {
    const userData = {
      ...this.registerFormateurData,
      role: UserRole.FORMATEUR
    };
    this.authService.register(userData).subscribe({
      next: () => {
        this.registerSuccess = 'Inscription réussie, veuillez vérifier votre email.';
        this.registerError = null;
      },
      error: () => {
        this.registerError = 'Erreur lors de l’inscription.';
        this.registerSuccess = null;
      }
    });
  }

  openRegisterModal(): void {
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal(): void {
    this.isRegisterModalOpen = false;
  }

  selectRole(role: 'apprenant' | 'formateur'): void {
  this.registrationStep = role === 'apprenant' ? 'formApprenant' : 'formFormateur';
}

backToRoleSelection(): void {
  this.registrationStep = 'roleSelection';
}

}
