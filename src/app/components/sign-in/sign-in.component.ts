import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
    selector: 'app-sign-in',
    standalone: false,
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
    email: string = '';
    password: string = '';
    showPassword: boolean = false;
    loading: boolean = false;
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private tokenService: TokenService,
        private router: Router
    ) {}

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit(): void {
        this.loading = true;
        this.errorMessage = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (response: any) => {
                console.log('📥 Réponse brute:', response);
                console.log('📥 Type:', typeof response);

                // ✅ ÉTAPE 1 : Extraire le token (peut être un objet OU une string JSON)
                let token: string = '';
                let emailFromResponse: string = '';

                try {
                    // Si c'est une string, essayer de la parser en JSON
                    if (typeof response === 'string') {
                        try {
                            const parsed = JSON.parse(response);
                            token = parsed.token || parsed.accessToken || '';
                            emailFromResponse = parsed.email || '';
                        } catch {
                            // Si ce n'est pas du JSON, c'est probablement le token directement
                            token = response;
                        }
                    } else {
                        // Si c'est déjà un objet
                        token = response.token || response.accessToken || '';
                        emailFromResponse = response.email || '';
                    }
                } catch (e) {
                    console.error('❌ Erreur parsing:', e);
                    this.errorMessage = 'Erreur de connexion';
                    this.loading = false;
                    return;
                }

                console.log('🔐 Token extrait:', token);
                console.log('📧 Email extrait:', emailFromResponse);

                if (!token) {
                    this.errorMessage = 'Token manquant dans la réponse';
                    this.loading = false;
                    return;
                }

                // ✅ ÉTAPE 2 : Sauvegarder le token
                this.tokenService.setToken(token);

                // ✅ ÉTAPE 3 : Décoder le JWT
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('👤 Payload JWT:', payload);

                    const role = payload.role;
                    const email = emailFromResponse || payload.sub;
                    const userId = payload.id;

                    // Sauvegarder les infos
                    this.tokenService.setUser(email);
                    this.tokenService.setRole(role);
                    this.tokenService.setUserId(userId);

                    console.log('✅ Rôle sauvegardé:', role);

                    // ✅ Redirection selon le rôle
                    if (role === 'ADMIN') {
                        console.log('➡️ Redirection vers ADMIN');
                        this.router.navigate(['/admin/dashboard']);
                    } else {
                        console.log('➡️ Redirection vers CLIENT');
                        this.router.navigate(['/dashboard']);
                    }
                } catch (e) {
                    console.error('❌ Erreur décodage JWT:', e);
                    this.errorMessage = 'Erreur de connexion';
                }

                this.loading = false;
            },
            error: (error) => {
                console.error('❌ Erreur login:', error);
                this.errorMessage = error.error || 'Email ou mot de passe incorrect';
                this.loading = false;
            }
        });
    }
}