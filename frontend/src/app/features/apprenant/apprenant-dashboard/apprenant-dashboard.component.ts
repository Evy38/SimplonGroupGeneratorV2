import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ListService } from '../../../core/services/list.service';
import { User } from '../../../core/services/models/user.model';
import { PromoService } from '../../../core/services/promo.service';


@Component({
  selector: 'app-apprenant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apprenant-dashboard.component.html',
  styleUrls: ['./apprenant-dashboard.component.css']
})
export class ApprenantDashboardComponent implements OnInit {
  currentUser: User | null = null;
  welcomeMessage: string = "Bienvenue sur votre Dashboard !";

  sharedLists: any[] = [];
  searchText: string = '';
  filterAccess: string = 'all'; // all, read, edit
promoName: string | null = null; 

  constructor(
    private readonly authService: AuthService,
    private readonly listService: ListService,
    private readonly promoService: PromoService, 
    private readonly auth: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser?.name) {
      this.welcomeMessage = `Bienvenue, ${this.currentUser.name} !`;
    }

  this.auth.currentUser$.subscribe(currentUser => {
    if (currentUser?.email) {
      const promo = this.promoService.getPromoByEmail(currentUser.email);
      if (promo) {
        this.promoName = promo.name;
      }
    }
  });

  }


}
