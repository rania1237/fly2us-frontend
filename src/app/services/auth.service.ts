import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RegisterRequest, LoginRequest, LoginResponse, User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:8081/users';

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) {}

    // ==========================================
    // INSCRIPTION
    // ==========================================
    register(user: RegisterRequest): Observable<User> {
        console.log('📤 AuthService.register - Données:', user);
        return this.http.post<User>(`${this.apiUrl}/signup`, user);
    }

    registerAdmin(user: RegisterRequest): Observable<User> {
        console.log('📤 AuthService.registerAdmin - Données:', user);
        return this.http.post<User>(`${this.apiUrl}/signup/admin`, user);
    }

    // ==========================================
    // ✅ CONNEXION (avec parsing JSON)
    // ==========================================
    login(credentials: LoginRequest): Observable<any> {
        console.log('📤 AuthService.login - Données:', credentials);
        
        return this.http.post<any>(`${this.apiUrl}/signin`, credentials, {
            responseType: 'text' as 'json'   // Le backend retourne une String JSON
        }).pipe(
            map((response: any) => {
                console.log('📥 Réponse brute:', response);
                console.log('📥 Type:', typeof response);

                // ✅ Si c'est une string JSON, la parser
                if (typeof response === 'string') {
                    try {
                        const parsed = JSON.parse(response);
                        console.log('✅ JSON parsé:', parsed);
                        return parsed;   // Retourne { email, token }
                    } catch {
                        // Ce n'est pas du JSON, c'est probablement le token directement
                        console.log('✅ Token direct (pas de JSON)');
                        return { token: response };
                    }
                }
                
                // Déjà un objet
                return response;
            })
        );
    }

    // ==========================================
    // ✅ RÉCUPÉRER L'EMAIL DU CLIENT CONNECTÉ
    // ==========================================
    getCurrentUserEmail(): string {
        return this.tokenService.getEmail();
    }

    // ==========================================
    // ✅ RÉCUPÉRER L'ID DU CLIENT
    // ==========================================
    getCurrentUserId(): number {
        return this.tokenService.getUserId();
    }

    // ==========================================
    // ✅ RÉCUPÉRER LE RÔLE
    // ==========================================
    getCurrentRole(): string {
        return this.tokenService.getRole() || '';
    }

    // ==========================================
    // ✅ DÉCONNEXION
    // ==========================================
    logout(): void {
        this.tokenService.logout();
    }

    // ==========================================
    // ✅ VÉRIFIER SI CONNECTÉ
    // ==========================================
    isLoggedIn(): boolean {
        return this.tokenService.isLoggedIn();
    }
}