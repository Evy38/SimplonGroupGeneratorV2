// src/app/features/apprenant/apprenant-groupe-list/apprenant-groupe-list.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { BriefService } from '../../../core/services/brief.service';
import { User } from '../../../core/services/models/user.model';
import { Person } from '../../../core/services/models/person.model';

// Interface pour structurer les données à afficher dans ce composant
export interface ApprenantGroupDisplayInfo {
  briefId: string;
  briefTitle: string;
  briefImageUrl?: string;
  groupId: string | number;
  groupName: string;
  groupMembers: Person[];
}

@Component({
  selector: 'app-apprenant-groupe-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './apprenant-groupe-list.component.html',
  styleUrls: ['./apprenant-groupe-list.component.css']
})
export class ApprenantGroupeListComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly briefService = inject(BriefService);
  private readonly subscriptions = new Subscription();

  currentUser: User | null = null;
  displayedGroupsInfo: ApprenantGroupDisplayInfo[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  selectedBriefId: string | null = null;
  selectedBrief: any = null;
  isBriefModalOpen: boolean = false;

  ngOnInit(): void {
    const sub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (
        this.currentUser &&
        this.currentUser.role === 'apprenant' &&
        this.currentUser.promoId
      ) {
        console.log(`ApprenantGroupeList: Initialisation pour l'utilisateur ID ${this.currentUser.id} et promoId ${this.currentUser.promoId}`);
        this.loadUserGroups(Number(this.currentUser.id), Number(this.currentUser.promoId));
      } else {
        console.error("ApprenantGroupeList: currentUser, rôle, ou promoId manquant.", this.currentUser);
        this.errorMessage = "Informations utilisateur ou de promotion manquantes pour afficher vos groupes.";
        this.isLoading = false;
      }
    });

    this.subscriptions.add(sub);
  }

loadUserGroups(userId: number, userPromoId: number): void {
  this.isLoading = true;
  this.errorMessage = null;

  const briefsSub = this.briefService.getBriefsByPromoId(String(userPromoId)).pipe(
    map(briefsFromPromo => {
      const groupsList: ApprenantGroupDisplayInfo[] = [];

      briefsFromPromo.forEach(brief => {
        if (brief.groups && Array.isArray(brief.groups) && brief.groups.length > 0) {
          brief.groups.forEach(workGroup => {
            const isMember = workGroup.members?.some(member => member.id === userId);
            if (isMember) {
              groupsList.push({
                briefId: String(brief.id),
                briefTitle: brief.name, // <-- remplacé title par name
                briefImageUrl: brief.imageUrl,
                groupId: workGroup.id,
                groupName: workGroup.nom,
                groupMembers: this.getGroupMembersExcludingUser(workGroup.members ?? [], userId)
              });
            }
          });
        }
      });

      return groupsList;
    })
  ).subscribe({
    next: (displayList) => {
      this.displayedGroupsInfo = displayList;
      this.isLoading = false;
    },
    error: (err: any) => {
      console.error("Erreur lors du chargement des groupes de l'apprenant:", err);
      this.errorMessage = "Une erreur est survenue lors de la récupération de vos groupes.";
      this.isLoading = false;
    }
  });

  this.subscriptions.add(briefsSub);
}


  openBriefModal(briefId: string): void {
    this.briefService.getBriefById(briefId).subscribe({
      next: (brief) => {
        this.selectedBrief = brief;
        this.isBriefModalOpen = true;
      },
      error: () => {
        this.selectedBrief = null;
        this.isBriefModalOpen = false;
        this.errorMessage = "Impossible de charger le brief.";
      }
    });
  }

  closeBriefModal(): void {
    this.selectedBrief = null;
    this.isBriefModalOpen = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

 private getGroupMembersExcludingUser(members: Person[], userId: number): Person[] {
  return members.filter(member => member.id !== userId);
}

}
