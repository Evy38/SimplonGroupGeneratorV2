import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { ListService } from '../../../core/services/list.service';
import { PromoService } from '../../../core/services/promo.service';

import { User } from '../../../core/services/models/user.model';
import { Person } from '../../../core/services/models/person.model';
import { Promo } from '../../../core/services/models/promo.model';

@Component({
  selector: 'app-apprenant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apprenant-dashboard.component.html',
  styleUrls: ['./apprenant-dashboard.component.css']
})
export class ApprenantDashboardComponent implements OnInit {
  currentUser: User | null = null;
  welcomeMessage: string = 'Bienvenue sur votre Dashboard !';

  sharedLists: any[] = [];
  searchText: string = '';
  filterAccess: string = 'all';

  promoName: string | null = null;
  currentPromoMembers: Person[] = [];
  currentPromoName: string = '';
  isLoading: boolean = true;

  isPromoModalOpen = false;

  constructor(
    private readonly authService: AuthService,
    private readonly listService: ListService,
    private readonly promoService: PromoService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (this.currentUser?.firstname && this.currentUser?.lastname) {
      this.welcomeMessage = `Bienvenue, ${this.currentUser.firstname} ${this.currentUser.lastname} !`;
    }

    if (this.currentUser?.email) {
      this.promoService.getAllPromos().subscribe((promos: Promo[]) => {
        const matchedPromo = promos.find(p =>
          p.members?.some(member => member.email === this.currentUser?.email)
        );

        if (matchedPromo) {
          this.currentPromoName = matchedPromo.nom;
          this.promoName = matchedPromo.nom;
          this.currentPromoMembers = matchedPromo.members ?? [];
        }

        this.isLoading = false;
      });
    }
  }

  openPromoModal() {
    this.isPromoModalOpen = true;
  }

  closePromoModal() {
    this.isPromoModalOpen = false;
  }
}
