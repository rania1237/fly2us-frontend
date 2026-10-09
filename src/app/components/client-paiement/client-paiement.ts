import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService, PaymentRequest, Payment } from '../../services/payment.service';
import { VisaTarif } from '../../services/visa-tarif.service';
import { DossierService, Dossier } from '../../services/dossier.service';
import { AuthService } from '../../services/auth.service';   // ✅ AJOUT IMPORT

@Component({
    selector: 'app-client-paiement',
    standalone: false,
    templateUrl: './client-paiement.html',
    styleUrls: ['./client-paiement.css']
})
export class ClientPaiement implements OnInit {

    dossierId!: number;
    dossier: Dossier | null = null;
    tarif: VisaTarif | null = null;

    loading: boolean = true;
    processing: boolean = false;
    paymentDone: boolean = false;

    message: string = '';
    errorMessage: string = '';

    method: string = 'CARTE_BANCAIRE';
    cardNumber: string = '';
    cardHolder: string = '';
    cardExpiry: string = '';
    cardCvv: string = '';

    // ✅ Dynamique (plus de valeur fixe)
    clientId!: number;
    clientEmail: string = '';
    paymentResult: Payment | null = null;

    constructor(
        private paymentService: PaymentService,
        private dossierService: DossierService,
        private authService: AuthService,   // ✅ AJOUT
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.dossierId = Number(this.route.snapshot.params['id']);
        
        // ✅ Récupérer l'ID et l'email du user connecté
        this.clientId = this.authService.getCurrentUserId();
        this.clientEmail = this.authService.getCurrentUserEmail();
        
        console.log('👤 Client ID :', this.clientId);
        console.log('📧 Client Email :', this.clientEmail);
        
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.cdr.detectChanges();

        this.dossierService.getDossierById(this.dossierId).subscribe({
            next: (d: Dossier) => {
                this.dossier = d;

                this.paymentService.isDossierPaid(this.dossierId).subscribe({
                    next: (paid: boolean) => {
                        if (paid) {
                            this.paymentDone = true;
                            this.message = '✅ Ce dossier est déjà payé';
                            this.loading = false;
                            this.cdr.detectChanges();
                            return;
                        }

                        this.paymentService.getTarifForDossier(this.dossierId).subscribe({
                            next: (t: VisaTarif) => {
                                this.tarif = t;
                                this.loading = false;
                                this.cdr.detectChanges();
                            },
                            error: (err: any) => {
                                console.error(err);
                                this.errorMessage = 'Aucun tarif défini pour ce dossier';
                                this.loading = false;
                                this.cdr.detectChanges();
                            }
                        });
                    },
                    error: () => {
                        this.loading = false;
                        this.cdr.detectChanges();
                    }
                });
            },
            error: (err: any) => {
                console.error(err);
                this.errorMessage = 'Dossier non trouvé';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    formatCardNumber(event: any): void {
        let value = event.target.value.replace(/\s/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        this.cardNumber = value;
        event.target.value = value;
    }

    pay(): void {
        if (!this.tarif) return;

        if (this.method === 'CARTE_BANCAIRE') {
            if (!this.cardNumber || this.cardNumber.replace(/\s/g, '').length < 16) {
                this.errorMessage = 'Numéro de carte invalide';
                this.cdr.detectChanges();
                return;
            }
            if (!this.cardHolder) {
                this.errorMessage = 'Nom du titulaire requis';
                this.cdr.detectChanges();
                return;
            }
            if (!this.cardCvv || this.cardCvv.length < 3) {
                this.errorMessage = 'CVV invalide';
                this.cdr.detectChanges();
                return;
            }
        }

        if (!confirm(`Confirmer le paiement de ${this.tarif.totalAmount} TND ?`)) return;

        this.processing = true;
        this.errorMessage = '';
        this.cdr.detectChanges();

        const request: PaymentRequest = {
            dossierId: this.dossierId,
            clientId: this.clientId,             // ✅ Dynamique
            method: this.method,
            cardNumber: this.method === 'CARTE_BANCAIRE' ? this.cardNumber.replace(/\s/g, '') : undefined,
            cardHolder: this.method === 'CARTE_BANCAIRE' ? this.cardHolder : undefined,
            clientEmail: this.clientEmail        // ✅ Dynamique (plus de client@example.com)
        };

        console.log('📤 Envoi paiement:', request);

        this.paymentService.initiatePayment(request).subscribe({
            next: (payment: Payment) => {
                this.paymentResult = payment;
                this.processing = false;

                if (payment.status === 'PAID') {
                    this.message = '🎉 Paiement accepté !';
                    this.paymentDone = true;
                } else {
                    this.errorMessage = '❌ Paiement refusé : ' + (payment.failureReason || 'Erreur');
                }

                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error(err);
                this.errorMessage = '❌ Erreur : ' + (err.error?.message || err.message);
                this.processing = false;
                this.cdr.detectChanges();
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/client/my-dossiers']);
    }
}