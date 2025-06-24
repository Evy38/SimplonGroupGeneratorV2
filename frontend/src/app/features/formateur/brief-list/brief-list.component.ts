// src/app/features/formateur/brief-list/brief-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Brief } from '../../../core/services/models/brief.model';
import { Promo } from '../../../core/services/models/promo.model';

import { BriefService } from '../../../core/services/brief.service';
import { PromoService } from '../../../core/services/promo.service';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-brief-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './brief-list.component.html',
  styleUrls: ['./brief-list.component.css'],
})
export class BriefListComponent implements OnInit {
  briefs$: Observable<Brief[]>;
  promos$: Observable<Promo[]>;

  private allPromos: Promo[] = [];
  isCreateBriefModalOpen: boolean = false;

  currentBriefData: {
    id: string | null;
    name: string;
    title: string;
    description: string;
    imageUrl: string;
    sourceGroupId: string | number | null;
    promoId: string | number | null;
    creationDate: Date | null;
    assignedGroupId: string | number | null;
  } = {
    id: null,
    name: '',
    title: '',
    description: '',
    imageUrl: '',
    sourceGroupId: null,
    promoId: null,
    creationDate: null,
    assignedGroupId: null,
  };

  formError: string | null = null;
  formSuccess: string | null = null;
  isEditMode: boolean = false;
  isConfirmDeleteModalOpen: boolean = false;
  briefToDeleteId: string | null = null;
  briefNameToDelete: string | null = null;

  briefs: any[] = [];
  groupsMap: { [briefId: string]: any[] } = {};
  availableGroups: any[] = [];
  selectedBriefId: number | null = null;
  selectedGroupId: number | null = null;

  constructor(
    private readonly briefService: BriefService,
    private readonly promoService: PromoService,
    private readonly http: HttpClient
  ) {
    this.briefs$ = this.briefService.getBriefsByMe();
    this.promos$ = this.promoService.getAllPromos().pipe(
      tap((promos: Promo[]) => {
        this.allPromos = promos;
        console.log('Promos stockées localement dans BriefListComponent:', this.allPromos);
      })
    );
  }

  ngOnInit(): void {
    this.briefs$.subscribe((briefs) => {
      this.briefs = briefs;
      for (let brief of briefs) {
        this.briefService.getGroupsForBrief(Number(brief.id)).subscribe({
          next: (groups) => this.groupsMap[brief.id] = groups,
          error: (err) => console.error("Erreur groupes :", err)
        });
      }

      this.promoService.getAllPromos().subscribe({
        next: (groups) => this.availableGroups = groups,
        error: (err) => console.error("Erreur chargement des groupes :", err)
      });
    });
  }

  openCreateBriefModal(): void {
    this.isEditMode = false;
    this.isCreateBriefModalOpen = true;
    this.currentBriefData = {
      id: null,
      name: '',
      title: '',
      description: '',
      imageUrl: '',
      sourceGroupId: null,
      promoId: null,
      creationDate: null,
      assignedGroupId: null,
    };
    this.formError = null;
    this.formSuccess = null;
  }

  openEditBriefModal(brief: Brief): void {
    this.isEditMode = true;
    this.isCreateBriefModalOpen = true;
    this.currentBriefData = {
      id: brief.id,
      name: brief.name,
      title: brief.title,
      description: brief.description,
      imageUrl: brief.imageUrl ?? '',
      sourceGroupId: brief.sourceGroupId,
      promoId: brief.promoId,
      creationDate: brief.creationDate,
      assignedGroupId: brief.assignedGroupId ?? null,
    };
    this.formError = null;
    this.formSuccess = null;
  }

  closeCreateBriefModal(): void {
    this.isCreateBriefModalOpen = false;
    this.isEditMode = false;
  }

  onSaveBriefSubmit(): void {
    this.formError = null;
    this.formSuccess = null;

    if (!this.currentBriefData.title.trim() || !this.currentBriefData.description.trim()) {
      this.formError = 'Le titre et la description du brief sont obligatoires.';
      return;
    }

    if (this.currentBriefData.sourceGroupId === null || this.currentBriefData.sourceGroupId === undefined) {
      this.formError = 'Veuillez assigner ce brief à une promo source.';
      return;
    }

    this.currentBriefData.promoId = this.currentBriefData.sourceGroupId;

    const briefPayload: Partial<Brief> = {
      name: this.currentBriefData.title,
      title: this.currentBriefData.title,
      description: this.currentBriefData.description,
      imageUrl: this.currentBriefData.imageUrl || undefined,
      promoId: this.currentBriefData.promoId !== null && this.currentBriefData.promoId !== undefined
        ? String(this.currentBriefData.promoId)
        : undefined,
      sourceGroupId: this.currentBriefData.sourceGroupId,
      assignedGroupId: this.currentBriefData.assignedGroupId,
      creationDate: new Date()
    };

    if (this.isEditMode && this.currentBriefData.id) {
      this.briefService.updateBrief(this.currentBriefData.id, briefPayload).subscribe(() => {
        this.formSuccess = `Brief '${briefPayload.title}' modifié avec succès.`;
        this.closeCreateBriefModal();
      });
    } else {
      this.briefService.createBrief(briefPayload).subscribe(() => {
        this.formSuccess = `Brief '${briefPayload.title}' créé avec succès.`;
        this.closeCreateBriefModal();
      });
    }
  }

  openConfirmDeleteModal(briefId: string, briefName: string, event: MouseEvent): void {
    event.stopPropagation();
    this.briefToDeleteId = briefId;
    this.briefNameToDelete = briefName;
    this.isConfirmDeleteModalOpen = true;
  }

  closeConfirmDeleteModal(): void {
    this.isConfirmDeleteModalOpen = false;
    this.briefToDeleteId = null;
    this.briefNameToDelete = null;
  }

  confirmDeleteBrief(): void {
    if (this.briefToDeleteId) {
      this.briefService.deleteBrief(this.briefToDeleteId).subscribe(() => {
        this.formSuccess = `Brief (ID: ${this.briefToDeleteId}) supprimé !`;
        this.closeConfirmDeleteModal();
      });
    }
    setTimeout(() => {
      this.formSuccess = null;
      this.formError = null;
    }, 2500);
  }

  assignGroupToBrief(): void {
    if (!this.selectedBriefId || !this.selectedGroupId) return;

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('/api/briefs/assign', {
      brief_id: this.selectedBriefId,
      group_id: this.selectedGroupId
    }, { headers }).subscribe({
      next: () => {
        this.selectedBriefId = null;
        this.selectedGroupId = null;
        this.briefService.getBriefsByMe().subscribe(b => this.briefs = b);
      },
      error: (err: any) => console.error("Erreur assignation :", err)
    });
  }

  handleModalKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.closeCreateBriefModal();
    }
  }
}
