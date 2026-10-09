import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-up',
    standalone: false,
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
    user = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '+21600000000',  // ✅ AJOUTER UN NUMÉRO PAR DÉFAUT
        role: 'CLIENT' as 'CLIENT' | 'ADMIN'
    };
    loading: boolean = false;
    errorMessage: string = '';
    successMessage: string = '';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(): void {
        // ✅ Vérifier les champs obligatoires
        if (!this.user.fullName || !this.user.email || !this.user.password) {
            this.errorMessage = 'Tous les champs sont obligatoires';
            return;
        }

        // ✅ Vérifier les mots de passe
        if (this.user.password !== this.user.confirmPassword) {
            this.errorMessage = 'Les mots de passe ne correspondent pas';
            return;
        }

        // ✅ Vérifier la longueur du mot de passe
        if (this.user.password.length < 8) {
            this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Séparer le nom complet
        const nameParts = this.user.fullName.trim().split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || 'Unknown';

        // ✅ Construire la requête
        const registerData = {
            email: this.user.email.trim(),
            password: this.user.password,
            firstName: firstName,
            lastName: lastName,
            phone: this.user.phone || '+21600000000',  // ✅ TOUJOURS UN NUMÉRO
            role: 'CLIENT' as 'CLIENT' | 'ADMIN'
        };

        // ✅ LOG POUR DÉBOGUER
        console.log('📤 Envoi de la requête:', registerData);

        this.authService.register(registerData).subscribe({
            next: (response) => {
                console.log('✅ Réponse:', response);
                this.successMessage = '✅ Inscription réussie ! Redirection vers login...';
                this.loading = false;
                setTimeout(() => {
                    this.router.navigate(['/signin']);
                }, 2000);
            },
            error: (error) => {
                console.error('❌ Erreur:', error);
                this.errorMessage = typeof error.error === 'string' ? error.error : '❌ Erreur lors de l\'inscription';
                this.loading = false;
            }
        });
    }
}