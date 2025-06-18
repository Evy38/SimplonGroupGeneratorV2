import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { BriefService } from '../../../core/services/brief.service';
import { PromoService } from '../../../core/services/promo.service';
import { User } from '../../../core/services/models/user.model';
import { Brief } from '../../../core/services/models/brief.model';
import { Promo } from '../../../core/services/models/promo.model';

@Component({
  selector: 'app-apprenant-brief-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './apprenant-brief-list.component.html',
  styleUrls: ['./apprenant-brief-list.component.css']
})
export class ApprenantBriefListComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  apprenantBriefs: Brief[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  private readonly subscriptions: Subscription = new Subscription();

  // MODALE de DÉTAIL
  isBriefDetailModalOpen: boolean = false;
  selectedBriefForModal: Brief | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly briefService: BriefService,
    private readonly promoService: PromoService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (this.currentUser?.email) {
      this.subscriptions.add(
        this.promoService.promos$.subscribe((promos: Promo[]) => {
          const matchedPromo = promos.find(promo =>
            promo.members?.some(member => member.email === this.currentUser?.email)
          );

          if (matchedPromo) {
            this.briefService.getBriefsByPromoId(String(matchedPromo.id)).subscribe({
              next: (briefs) => {
                this.apprenantBriefs = briefs;
                this.isLoading = false;
              },
              error: (err) => {
                console.error('Erreur lors du chargement des briefs :', err);
                this.errorMessage = 'Erreur lors du chargement des briefs.';
                this.isLoading = false;
              }
            });
          } else {
            this.errorMessage = "Aucune promo trouvée pour l'utilisateur.";
            this.isLoading = false;
          }
        })
      );
    }
  }

  openBriefDetail(brief: Brief): void {
    this.selectedBriefForModal = brief;
    this.isBriefDetailModalOpen = true;
  }

  closeBriefDetail(): void {
    this.selectedBriefForModal = null;
    this.isBriefDetailModalOpen = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
