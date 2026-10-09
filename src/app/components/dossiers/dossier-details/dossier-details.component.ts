import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierService, Dossier, DossierDocument } from '../../../services/dossier.service';

@Component({
    selector: 'app-dossier-details',
    standalone: false,
    templateUrl: './dossier-details.component.html',
    styleUrls: ['./dossier-details.component.css']
})
export class DossierDetailsComponent implements OnInit {

    dossier: Dossier | null = null;
    documents: DossierDocument[] = [];
    loading: boolean = true;
    message: string = '';

    constructor(
        private dossierService: DossierService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.params['id']);
        this.loadDossier(id);
    }

    loadDossier(id: number): void {
        this.dossierService.getDossierById(id).subscribe({
            next: (data) => {
                this.dossier = data;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    validateDocument(documentId: number): void {
        this.dossierService.validateDocument(documentId, 1).subscribe({
            next: () => {
                this.message = '✅ Document validé';
                if (this.dossier?.id) this.loadDossier(this.dossier.id);
            }
        });
    }

    rejectDocument(documentId: number): void {
        const reason = prompt('Raison du rejet :');
        if (reason) {
            this.dossierService.rejectDocument(documentId, 1, reason).subscribe({
                next: () => {
                    this.message = '❌ Document rejeté - Alerte envoyée au client';
                    if (this.dossier?.id) this.loadDossier(this.dossier.id);
                }
            });
        }
    }

    downloadPdf(): void {
        if (this.dossier?.id) {
            this.dossierService.downloadPdf(this.dossier.id).subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dossier-${this.dossier?.dossierNumber}.pdf`;
                    a.click();
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/dossiers']);
    }
}