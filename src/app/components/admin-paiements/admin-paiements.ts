import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PaymentService, Payment } from '../../services/payment.service';

@Component({
    selector: 'app-admin-paiements',
    standalone: false,
    templateUrl: './admin-paiements.html',        // ✅ CORRIGÉ
    styleUrls: ['./admin-paiements.css']          // ✅ CORRIGÉ
})
export class AdminPaiements implements OnInit {    // ✅ CORRIGÉ

    payments: Payment[] = [];
    filteredPayments: Payment[] = [];
    loading: boolean = true;
    message: string = '';
    errorMessage: string = '';

    selectedStatus: string = 'TOUS';
    statusList = ['TOUS', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'];

    stats = { total: 0, paid: 0, pending: 0, revenue: 0 };

    constructor(
        private service: PaymentService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadPayments();
    }

    loadPayments(): void {
        this.loading = true;
        this.service.getAllPayments().subscribe({
            next: (data: Payment[]) => {              // ✅ TYPÉ
                this.payments = data;
                this.applyFilter();
                this.calculateStats();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {                     // ✅ TYPÉ
                console.error(err);
                this.errorMessage = 'Erreur lors du chargement';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    calculateStats(): void {
        this.stats.total = this.payments.length;
        this.stats.paid = this.payments.filter(p => p.status === 'PAID').length;
        this.stats.pending = this.payments.filter(p => p.status === 'PENDING').length;
        this.stats.revenue = this.payments
            .filter(p => p.status === 'PAID')
            .reduce((sum, p) => sum + p.amount, 0);
    }

    applyFilter(): void {
        if (this.selectedStatus === 'TOUS') {
            this.filteredPayments = this.payments;
        } else {
            this.filteredPayments = this.payments.filter(p => p.status === this.selectedStatus);
        }
    }

    onStatusChange(event: Event): void {
        this.selectedStatus = (event.target as HTMLSelectElement).value;
        this.applyFilter();
    }

    refund(payment: Payment): void {
        if (!confirm(`Rembourser ${payment.amount} TND ?`)) return;

        this.service.refund(payment.id!).subscribe({
            next: () => {
                this.message = '💸 Remboursement effectué';
                this.loadPayments();
            },
            error: () => {
                this.errorMessage = '❌ Erreur lors du remboursement';
                this.cdr.detectChanges();
            }
        });
    }
}