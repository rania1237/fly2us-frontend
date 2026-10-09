import { Component } from '@angular/core';
import { TokenService } from './services/token.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(
        private tokenService: TokenService,
        private router: Router
    ) {}

    // ✅ Vérifier si l'utilisateur est connecté
    isLoggedIn(): boolean {
        return this.tokenService.isLoggedIn();
    }
}