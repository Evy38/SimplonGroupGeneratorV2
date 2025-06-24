import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/services/models/user.model';
import { Person } from '../../core/services/models/person.model';
import { Promo } from '../../core/services/models/promo.model';
import { PromoService } from '../../core/services/promo.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  personDetails: Person | null = null;
  userPromos: Promo[] = [];

  showPasswordForm = false;
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordChangeMessage = '';
  passwordFieldType = 'password';

  constructor(
    private readonly authService: AuthService,
    private readonly promoService: PromoService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });


    if (this.currentUser?.email) {
      this.promoService.getAllPromos().subscribe((promos: Promo[]) => {
        this.userPromos = promos.filter(p =>
          p.people?.some(m => m.email === this.currentUser?.email)
        );
        const promo = this.userPromos[0];
        if (promo) {
          this.personDetails = promo.people?.find(m => m.email === this.currentUser?.email) || null;
        }
      });

    }
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordChangeMessage = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  handleChangePassword(): void {
    if (!this.currentUser) return;

    if (this.newPassword.length < 6) {
      this.passwordChangeMessage = 'Le nouveau mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordChangeMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }

    if (this.currentUser.id) {
      this.authService.updateUserPassword(this.currentUser.id, this.newPassword);
      this.passwordChangeMessage = 'Mot de passe changé avec succès (simulation) !';
      this.showPasswordForm = false;
    } else {
      this.passwordChangeMessage = 'Erreur : identifiant utilisateur manquant.';
    }
  }

  navigateToDashboard(): void {
    if (!this.currentUser) return;

    if (this.currentUser.role === 'formateur') {
      this.router.navigate(['/formateur/dashboard']);
    } else if (this.currentUser.role === 'apprenant') {
      this.router.navigate(['/apprenant/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
