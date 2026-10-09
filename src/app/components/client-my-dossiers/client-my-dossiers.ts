import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DossierService, Dossier } from '../../services/dossier.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-client-my-dossiers',
    standalone: false,
    templateUrl: './client-my-dossiers.html',
    styleUrls: ['./client-my-dossiers.css']
})
export class ClientMyDossiers implements OnInit {
    dossiers: Dossier[] = [];
    loading: boolean = true;
    errorMessage: string = '';
    clientId!: number;

    constructor(
        private dossierService: DossierService,
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // ✅ Récupérer l'ID du user CONNECTÉ
        this.clientId = this.authService.getCurrentUserId();
        console.log('👤 Client ID connecté:', this.clientId);
        console.log('📧 Email connecté:', this.authService.getCurrentUserEmail());

        if (!this.clientId) {
            this.errorMessage = 'Utilisateur non connecté';
            this.loading = false;
            return;
        }

        this.loadMyDossiers();
    }

    loadMyDossiers(): void {
        this.loading = true;
        this.dossierService.getDossiersByClient(this.clientId).subscribe({
            next: (data) => {
                console.log('📁 Dossiers reçus:', data);
                this.dossiers = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.errorMessage = 'Erreur de chargement';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deposerDossier(dossierId: number): void {
        this.router.navigate(['/client/dossier-submit', dossierId]);
    }

    payerDossier(dossierId: number): void {
        this.router.navigate(['/client/paiement', dossierId]);
    }

    getStatusColor(status: string | undefined): string {
        switch (status) {
            case 'BROUILLON': return '#fef3c7';
            case 'EN_ATTENTE_VERIFICATION': return '#dbeafe';
            case 'EN_COURS': return '#dbeafe';
            case 'APPROUVE': return '#d1fae5';
            case 'REFUSE': return '#fee2e2';
            case 'DOCUMENT_REJETE': return '#fee2e2';
            default: return '#e5e7eb';
        }
    }

    getStatusTextColor(status: string | undefined): string {
        switch (status) {
            case 'BROUILLON': return '#92400e';
            case 'EN_ATTENTE_VERIFICATION': return '#1e40af';
            case 'EN_COURS': return '#1e40af';
            case 'APPROUVE': return '#065f46';
            case 'REFUSE': return '#991b1b';
            case 'DOCUMENT_REJETE': return '#991b1b';
            default: return '#333';
        }
    }
}