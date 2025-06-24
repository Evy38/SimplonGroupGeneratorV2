import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';

import { Brief } from '../../../core/services/models/brief.model';
import { Promo } from '../../../core/services/models/promo.model';
import { BriefService } from '../../../core/services/brief.service';
import { PromoService } from '../../../core/services/promo.service';

@Component({
  selector: 'app-brief-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './brief-list.component.html',
  styleUrls: ['./brief-list.component.css']
})
export class BriefListComponent implements OnInit {
  briefs$: Observable<Brief[]>;
  promos$: Observable<Promo[]>;
  availableGroups: Promo[] = [];

  isCreateBriefModalOpen = false;
  isEditMode = false;
  isConfirmDeleteModalOpen = false;

  currentBriefData = {
    id: null as number | null,
    name: '',
    description: '',
    imageUrl: '',
    sourceGroupId: null as number | null,
    promoId: null as number | null,
    creationDate: null as Date | null,
    assignedGroupId: null as number | null
  };

  selectedBriefId: number | null = null;
  selectedGroupId: number | null = null;

  formError: string | null = null;
  formSuccess: string | null = null;
  briefToDeleteId: number | null = null;
  briefNameToDelete: string | null = null;

  groupsMap: { [briefId: number]: any[] } = [];

  constructor(
    private readonly briefService: BriefService,
    private readonly promoService: PromoService
  ) {
    this.briefs$ = this.briefService.getBriefsByMe();
    this.promos$ = this.promoService.getAllPromos().pipe(
      tap(promos => this.availableGroups = promos)
    );
  }

  ngOnInit(): void {
    this.briefs$.subscribe(briefs => {
      for (let brief of briefs) {
        this.briefService.getGroupsForBrief(brief.id).subscribe({
          next: (groups) => this.groupsMap[brief.id] = groups,
          error: (err) => console.error("Erreur groupes :", err)
        });
      }
    });
  }

  openCreateBriefModal(): void {
    this.isEditMode = false;
    this.isCreateBriefModalOpen = true;
    this.resetForm();
  }

  openEditBriefModal(brief: Brief): void {
    this.isEditMode = true;
    this.isCreateBriefModalOpen = true;
    this.currentBriefData = {
      id: brief.id,
      name: brief.name,
      description: brief.description,
      imageUrl: brief.imageUrl ?? '',
      sourceGroupId: brief.sourceGroupId !== null && brief.sourceGroupId !== undefined ? Number(brief.sourceGroupId) : null,
      promoId: brief.promoId,
      creationDate: new Date(brief.creationDate),
      assignedGroupId: brief.assignedGroupId !== null && brief.assignedGroupId !== undefined ? Number(brief.assignedGroupId) : null,
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

    const { name, description, sourceGroupId } = this.currentBriefData;

    if (!name.trim() || !description.trim()) {
      this.formError = 'Le titre et la description du brief sont obligatoires.';
      return;
    }

    if (sourceGroupId === null) {
      this.formError = 'Veuillez assigner ce brief à une promo source.';
      return;
    }

    const briefPayload: Partial<Brief> = {
      name: name,
      description,
      imageUrl: this.currentBriefData.imageUrl || undefined,
      promoId: sourceGroupId,
      sourceGroupId,
      assignedGroupId: this.currentBriefData.assignedGroupId ?? undefined,
      creationDate: new Date()
    };

    const action$ = this.isEditMode && this.currentBriefData.id
      ? this.briefService.updateBrief(String(this.currentBriefData.id), briefPayload)
      : this.briefService.createBrief(briefPayload);

    action$.subscribe(() => {
      this.formSuccess = `Brief « ${name} » ${this.isEditMode ? 'modifié' : 'créé'} avec succès.`;
      this.closeCreateBriefModal();
    });
  }

  openConfirmDeleteModal(briefId: number, briefName: string, event: MouseEvent): void {
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
    if (this.briefToDeleteId !== null) {
      this.briefService.deleteBrief(String(this.briefToDeleteId)).subscribe(() => {
        this.formSuccess = `Brief supprimé !`;
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

    this.briefService.assignGroupToBrief(this.selectedBriefId, this.selectedGroupId).subscribe({
      next: () => {
        this.selectedBriefId = null;
        this.selectedGroupId = null;
        this.briefService.getBriefsByMe().subscribe();
      },
      error: err => console.error('Erreur assignation :', err)
    });
  }

  handleModalKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.closeCreateBriefModal();
    }
  }

  private resetForm(): void {
    this.currentBriefData = {
      id: null,
      name: '',
      description: '',
      imageUrl: '',
      sourceGroupId: null,
      promoId: null,
      creationDate: null,
      assignedGroupId: null
    };
  }
}
