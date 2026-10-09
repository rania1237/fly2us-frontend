import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierService, Dossier, DossierDocument } from '../../../services/dossier.service';
import { DocumentRequirementService, DocumentRequirement } from '../../../services/document-requirement.service';

@Component({
    selector: 'app-dossier-submit',
    standalone: false,
    templateUrl: './dossier-submit.component.html',
    styleUrls: ['./dossier-submit.component.css']
})
export class DossierSubmitComponent implements OnInit {

    dossierId!: number;
    dossier: Dossier | null = null;
    requirements: DocumentRequirement[] = [];
    uploadedDocuments: DossierDocument[] = [];
    isComplete: boolean = false;
    uploading: boolean = false;
    loading: boolean = true;
    message: string = '';
    errorMessage: string = '';
    clientId: number = 1;

    constructor(
        private dossierService: DossierService,
        private documentRequirementService: DocumentRequirementService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.dossierId = Number(this.route.snapshot.params['id']);
        console.log('🚀 ngOnInit - dossierId =', this.dossierId);
        this.loadDossier();
    }

    // ==========================================
    // CHARGER LE DOSSIER
    // ==========================================
    loadDossier(): void {
        this.loading = true;
        console.log('🚀 loadDossier - ID =', this.dossierId);

        this.dossierService.getDossierById(this.dossierId).subscribe({
            next: (data) => {
                console.log('✅ Dossier reçu:', data);
                this.dossier = data;
                this.loadRequirements(data.type);
            },
            error: (err) => {
                console.error('❌ Erreur:', err);
                this.errorMessage = 'Dossier non trouvé';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // CHARGER LES DOCUMENTS REQUIS
    // ==========================================
    loadRequirements(visaType: string): void {
        console.log('🚀 loadRequirements - visaType =', visaType);

        this.documentRequirementService.getByVisaType(visaType).subscribe({
            next: (reqs) => {
                console.log('📋 Documents requis:', reqs);
                this.requirements = reqs;
                this.loadUploadedDocuments();
            },
            error: (err) => {
                console.error('❌ Erreur:', err);
                this.errorMessage = 'Erreur chargement';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // CHARGER LES DOCUMENTS UPLOADÉS
    // ==========================================
    loadUploadedDocuments(): void {
        console.log('🚀 loadUploadedDocuments');

        this.dossierService.getDocumentsByDossier(this.dossierId).subscribe({
            next: (docs) => {
                console.log('📁 Documents uploadés:', docs);
                this.uploadedDocuments = docs;
                this.checkCompleteness();
                this.loading = false;
                this.cdr.detectChanges();
                console.log('✅ Vue mise à jour !');
            },
            error: (err) => {
                console.error('❌ Erreur:', err);
                this.uploadedDocuments = [];
                this.checkCompleteness();
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // UPLOADER UN DOCUMENT
    // ==========================================
    onFileSelected(event: any, requirement: DocumentRequirement): void {
        const file: File = event.target.files[0];
        if (!file) return;
        if (!requirement.id) {
            this.errorMessage = '❌ Erreur : ID manquant';
            return;
        }

        const maxSizeMb = requirement.maxSizeMb || 10;
        if (file.size > maxSizeMb * 1024 * 1024) {
            this.errorMessage = `❌ Fichier trop volumineux (max ${maxSizeMb} Mo)`;
            this.cdr.detectChanges();
            return;
        }

        this.uploading = true;
        this.errorMessage = '';
        this.message = '';
        this.cdr.detectChanges();

        this.dossierService.uploadDocument(this.dossierId, requirement.id, file, this.clientId).subscribe({
            next: (doc) => {
                const index = this.uploadedDocuments.findIndex(d => d.requirementId === requirement.id);
                if (index >= 0) {
                    this.uploadedDocuments[index] = doc;
                } else {
                    this.uploadedDocuments.push(doc);
                }
                this.uploading = false;
                this.message = `✅ ${file.name} uploadé avec succès`;
                
                // ✅ RECHARGER LE DOSSIER pour mettre à jour son statut global
                this.reloadDossierStatus();
                this.checkCompleteness();
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.message = '';
                    this.cdr.detectChanges();
                }, 3000);
            },
            error: (err) => {
                console.error('Erreur upload:', err);
                this.errorMessage = `❌ Erreur upload`;
                this.uploading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // ✅ RECHARGER LE STATUT DU DOSSIER
    // ==========================================
    reloadDossierStatus(): void {
        this.dossierService.getDossierById(this.dossierId).subscribe({
            next: (data) => {
                this.dossier = data;
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // VÉRIFIER SI UN DOCUMENT EST UPLOADÉ
    // ==========================================
    isDocumentUploaded(requirementId: number | undefined): boolean {
        if (!requirementId) return false;
        return this.uploadedDocuments.some(d => d.requirementId === requirementId);
    }

    // ==========================================
    // ✅ VÉRIFIER SI UN DOCUMENT EST REJETÉ
    // ==========================================
    isDocumentRejected(requirementId: number | undefined): boolean {
        if (!requirementId) return false;
        const doc = this.uploadedDocuments.find(d => d.requirementId === requirementId);
        return doc?.status === 'REJECTED';
    }

    // ==========================================
    // ✅ RÉCUPÉRER LA RAISON DU REJET
    // ==========================================
    getRejectionReason(requirementId: number | undefined): string {
        if (!requirementId) return '';
        const doc = this.uploadedDocuments.find(d => d.requirementId === requirementId);
        return doc?.rejectionReason || 'Non précisée';
    }

    // ==========================================
    // ✅ VÉRIFIER SI LE DOSSIER EST GLOBALEMENT REJETÉ
    // ==========================================
    isDossierRejected(): boolean {
        return this.dossier?.status === 'DOCUMENT_REJETE' || this.dossier?.status === 'REFUSE';
    }

    // ==========================================
    // ✅ COMPTER LES DOCUMENTS REJETÉS
    // ==========================================
    countRejectedDocuments(): number {
        return this.uploadedDocuments.filter(d => d.status === 'REJECTED').length;
    }

    // ==========================================
    // VÉRIFIER SI LE DOSSIER EST COMPLET
    // ==========================================
    checkCompleteness(): void {
        this.dossierService.isComplete(this.dossierId).subscribe({
            next: (complete) => {
                this.isComplete = complete;
                console.log('🎯 Dossier complet ?', complete);
                this.cdr.detectChanges();
            },
            error: () => {
                this.isComplete = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // SOUMETTRE LE DOSSIER
    // ==========================================
    submitDossier(): void {
        if (!this.isComplete) {
            this.errorMessage = '⚠️ Tous les documents obligatoires doivent être fournis.';
            this.cdr.detectChanges();
            return;
        }

        if (confirm('Déposer ce dossier ? Cette action est définitive.')) {
            this.dossierService.submitDossier(this.dossierId, this.clientId).subscribe({
                next: () => {
                    this.message = '✅ Dossier déposé avec succès !';
                    this.cdr.detectChanges();
                    setTimeout(() => this.router.navigate(['/client/my-dossiers']), 2000);
                },
                error: (err) => {
                    console.error('Erreur submit:', err);
                    this.errorMessage = '❌ Erreur lors du dépôt';
                    this.cdr.detectChanges();
                }
            });
        }
    }

    // ==========================================
    // TÉLÉCHARGER LE PDF
    // ==========================================
    downloadPdf(): void {
        this.dossierService.downloadPdf(this.dossierId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dossier-${this.dossier?.dossierNumber}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Erreur PDF:', err);
                this.errorMessage = '❌ Erreur PDF';
                this.cdr.detectChanges();
            }
        });
    }

    // ==========================================
    // RETOUR
    // ==========================================
    goBack(): void {
        this.router.navigate(['/client/my-dossiers']);
    }
}