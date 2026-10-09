import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VisaTarif } from './visa-tarif.service';

export interface Payment {
    id?: number;
    dossierId: number;
    clientId: number;
    amount: number;
    currency: string;
    method: string;
    status: string;
    transactionId?: string;
    cardLast4?: string;
    cardHolder?: string;
    failureReason?: string;
    paidAt?: Date;
    emailSent?: boolean;
    createdAt?: Date;
}

export interface PaymentRequest {
    dossierId: number;
    clientId: number;
    method: string;
    cardNumber?: string;
    cardHolder?: string;
    clientEmail?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private apiUrl = 'http://localhost:8083/api/payments';

    constructor(private http: HttpClient) {}

    getTarifForDossier(dossierId: number): Observable<VisaTarif> {
        return this.http.get<VisaTarif>(`${this.apiUrl}/tarif/${dossierId}`);
    }

    isDossierPaid(dossierId: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/is-paid/${dossierId}`);
    }

    initiatePayment(request: PaymentRequest): Observable<Payment> {
        return this.http.post<Payment>(`${this.apiUrl}/initiate`, request);
    }

    getPaymentsByClient(clientId: number): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${this.apiUrl}/client/${clientId}`);
    }

    getPaymentsByDossier(dossierId: number): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${this.apiUrl}/dossier/${dossierId}`);
    }

    getAllPayments(): Observable<Payment[]> {
        return this.http.get<Payment[]>(this.apiUrl);
    }

    refund(paymentId: number): Observable<Payment> {
        return this.http.post<Payment>(`${this.apiUrl}/${paymentId}/refund`, {});
    }
}