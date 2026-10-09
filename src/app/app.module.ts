import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ================= AUTH =================
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

// ================= CLIENT =================
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ClientMyDossiers } from './components/client-my-dossiers/client-my-dossiers';

// ================= ADMIN =================
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminDossiersComponent } from './components/admin-dossiers/admin-dossiers.component';
import { AdminDocumentsComponent } from './components/admin-documents/admin-documents.component';

// ================= ADMIN VISA CRUD =================
import { VisaListComponent } from './components/visas/visa-list/visa-list.component';
import { VisaAddComponent } from './components/visas/visa-add/visa-add.component';
import { VisaDetailsComponent } from './components/visas/visa-details/visa-details.component';

// ================= DOSSIERS =================
import { DossierListComponent } from './components/dossiers/dossier-list/dossier-list.component';
import { DossierCreateComponent } from './components/dossiers/dossier-create/dossier-create.component';
import { DossierSubmitComponent } from './components/dossiers/dossier-submit/dossier-submit.component';
import { DossierDetailsComponent } from './components/dossiers/dossier-details/dossier-details.component';

// ================= ✅ PAIEMENTS =================
import { AdminTarifs } from './components/admin-tarifs/admin-tarifs';
import { AdminPaiements } from './components/admin-paiements/admin-paiements';
import { ClientPaiement } from './components/client-paiement/client-paiement';

// ================= INTERCEPTOR =================
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
    declarations: [
        // ========== ROOT ==========
        AppComponent,

        // ========== AUTH ==========
        SignInComponent,
        SignUpComponent,

        // ========== CLIENT ==========
        DashboardComponent,
        SidebarComponent,
        HeaderComponent,
        ClientMyDossiers,

        // ========== ADMIN ==========
        AdminDashboardComponent,
        AdminUsersComponent,
        AdminDossiersComponent,
        AdminDocumentsComponent,

        // ========== ADMIN VISA CRUD ==========
        VisaListComponent,
        VisaAddComponent,
        VisaDetailsComponent,

        // ========== DOSSIERS ==========
        DossierListComponent,
        DossierCreateComponent,
        DossierSubmitComponent,
        DossierDetailsComponent,

        // ========== ✅ PAIEMENTS ==========
        AdminTarifs,
        AdminPaiements,
        ClientPaiement,
    ],

    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
    ],

    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}