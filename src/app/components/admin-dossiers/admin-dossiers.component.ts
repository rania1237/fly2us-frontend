import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DossierService, Dossier, DossierDocument } from '../../services/dossier.service';
import { TokenService } from '../../services/token.service';

@Component({
    selector: 'app-admin-dossiers',
    standalone: false,
    templateUrl: './admin-dossiers.component.html',
    styleUrls: ['./admin-dossiers.component.css']
})
export class AdminDossiersComponent implements OnInit {

    // ====== VARIABLES ======
    dossiers: Dossier[] = [];
    filteredDossiers: Dossier[] = [];
    selectedDossier: Dossier | null = null;
    documents: DossierDocument[] = [];

    // ====== ÉTATS ======
    view: 'list' | 'details' = 'list';
    loading: boolean = false;
    message: string = '';
    errorMessage: string = '';

    // ====== FILTRES ======
    selectedStatus: string = 'TOUS';
    searchText: string = '';
    statusList = ['TOUS', 'BROUILLON', 'EN_ATTENTE_VERIFICATION', 'EN_COURS', 'APPROUVE', 'REFUSE', 'DOCUMENT_REJETE'];

    // ====== STATISTIQUES ======
    stats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    };

    // ====== ID ADMIN ======
    adminId: number = 1;

    constructor(
        private dossierService: DossierService,
        private tokenService: TokenService,
        private cdr: ChangeDetectorRef  // ✅ AJOUT
    ) {}

    ngOnInit(): void {
        this.loadDossiers();
    }

    // ==========================================
    // LISTE DES DOSSIERS
    // ==========================================
    loadDossiers(): void {
        this.loading = true;
        this.dossierService.getAllDossiers().subscribe({
            next: (data: Dossier[]) => {
                this.dossiers = data;
                this.applyFilter();
                this.calculateStats();
                this.loading = false;
                this.cdr.detectChanges();  // ✅ AJOUT
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.errorMessage = 'Erreur lors du chargement';
                this.loading = false;
                this.cdr.detectChanges();  // ✅ AJOUT
            }
        });
    }

    calculateStats(): void {
        this.stats.total = this.dossiers.length;
        this.stats.pending = this.dossiers.filter(d =>
            d.status === 'EN_ATTENTE_VERIFICATION' || d.status === 'EN_COURS'
        ).length;
        this.stats.approved = this.dossiers.filter(d => d.status === 'APPROUVE').length;
        this.stats.rejected = this.dossiers.filter(d =>
            d.status === 'REFUSE' || d.status === 'DOCUMENT_REJETE'
        ).length;
    }

    applyFilter(): void {
        let filtered = this.dossiers;

        if (this.selectedStatus !== 'TOUS') {
            filtered = filtered.filter(d => d.status === this.selectedStatus);
        }

        if (this.searchText) {
            filtered = filtered.filter(d =>
                d.dossierNumber?.toLowerCase().includes(this.searchText.toLowerCase()) ||
                d.country?.toLowerCase().includes(this.searchText.toLowerCase()) ||
                d.type?.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }

        this.filteredDossiers = filtered;
    }

    onStatusChange(event: Event): void {
        this.selectedStatus = (event.target as HTMLSelectElement).value;
        this.applyFilter();
    }

    onSearchChange(event: Event): void {
        this.searchText = (event.target as HTMLInputElement).value;
        this.applyFilter();
    }

    // ==========================================
    // DÉTAILS DU DOSSIER
    // ==========================================
    showDetails(dossier: Dossier): void {
        this.selectedDossier = dossier;
        this.view = 'details';
        this.loadDocuments(dossier.id!);
    }

    showList(): void {
        this.view = 'list';
        this.selectedDossier = null;
        this.documents = [];
        this.loadDossiers();
    }

    loadDocuments(dossierId: number): void {
        this.loading = true;
        this.cdr.detectChanges();

        this.dossierService.getDocumentsByDossier(dossierId).subscribe({
            next: (data) => {
                this.documents = data;
                this.loading = false;
                this.cdr.detectChanges();  // ✅ AJOUT
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.loading = false;
                this.cdr.detectChanges();  // ✅ AJOUT
            }
        });
    }

    // ==========================================
    // VALIDER / REJETER UN DOCUMENT
    // ==========================================
    validateDocument(documentId: number): void {
        if (!confirm('Valider ce document ?')) return;

        this.dossierService.validateDocument(documentId, this.adminId).subscribe({
            next: () => {
                this.message = '✅ Document validé avec succès';
                this.loadDocuments(this.selectedDossier!.id!);
            },
            error: () => {
                this.errorMessage = '❌ Erreur lors de la validation';
                this.cdr.detectChanges();
            }
        });
    }

    rejectDocument(documentId: number): void {
        const reason = prompt('Raison du rejet :');
        if (!reason) return;

        this.dossierService.rejectDocument(documentId, this.adminId, reason).subscribe({
            next: () => {
                this.message = '❌ Document rejeté - Alerte envoyée au client';
                this.loadDocuments(this.selectedDossier!.id!);
                this.loadDossiers();
            },
            error: () => {
                this.errorMessage = '❌ Erreur lors du rejet';
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // CHANGER LE STATUT DU DOSSIER
    // ==========================================
    changeStatus(newStatus: string): void {
        if (!this.selectedDossier?.id) return;

        const comment = prompt('Commentaire (optionnel) :') || '';

        this.dossierService.updateStatus(this.selectedDossier.id, newStatus, comment).subscribe({
            next: (updated) => {
                this.selectedDossier = updated;
                this.message = '✅ Statut mis à jour : ' + newStatus;
                this.loadDossiers();
                this.cdr.detectChanges();
            },
            error: () => {
                this.errorMessage = '❌ Erreur lors du changement de statut';
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // TÉLÉCHARGER LE PDF
    // ==========================================
    downloadPdf(dossierId: number): void {
        this.dossierService.downloadPdf(dossierId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dossier-${this.selectedDossier?.dossierNumber}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => {
                this.errorMessage = '❌ Erreur lors du téléchargement';
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // SUPPRIMER UN DOSSIER
    // ==========================================
    deleteDossier(id: number): void {
        if (!confirm('Voulez-vous vraiment supprimer ce dossier ?')) return;

        this.dossierService.deleteDossier(id).subscribe({
            next: () => {
                this.message = '🗑️ Dossier supprimé';
                this.loadDossiers();
            },
            error: () => {
                this.errorMessage = '❌ Erreur lors de la suppression';
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // ✅ VOIR UN DOCUMENT (dans un nouvel onglet)
    // ==========================================
    viewDocument(doc: DossierDocument): void {
        if (!doc.id) {
            alert('Document invalide');
            return;
        }

        this.dossierService.downloadDocumentFile(doc.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
                setTimeout(() => window.URL.revokeObjectURL(url), 60000);
            },
            error: (err) => {
                console.error('Erreur:', err);
                alert('❌ Impossible d\'ouvrir le fichier');
            }
        });
    }

    // ==========================================
    // ✅ VÉRIFIER LE TYPE DE FICHIER (pour aperçu inline)
    // ==========================================
    isImage(fileType: string | undefined): boolean {
        if (!fileType) return false;
        return fileType.startsWith('image/');
    }

    isPdf(fileType: string | undefined): boolean {
        if (!fileType) return false;
        return fileType === 'application/pdf';
    }

    // ==========================================
    // UTILITAIRES
    // ==========================================
    getStatusClass(status: string): string {
        switch (status) {
            case 'BROUILLON': return 'badge-gray';
            case 'EN_ATTENTE_VERIFICATION': return 'badge-yellow';
            case 'EN_COURS': return 'badge-blue';
            case 'APPROUVE': return 'badge-green';
            case 'REFUSE': return 'badge-red';
            case 'DOCUMENT_REJETE': return 'badge-red';
            default: return 'badge-gray';
        }
    }

    getDocumentStatusClass(status: string): string {
        switch (status) {
            case 'PENDING': return 'badge-gray';
            case 'UPLOADED': return 'badge-yellow';
            case 'VALIDATED': return 'badge-green';
            case 'REJECTED': return 'badge-red';
            default: return 'badge-gray';
        }
    }
}