import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VisaService, Visa } from '../../../services/visa.service';
@Component({
  selector: 'app-visa-add',
  standalone: false,
  templateUrl: './visa-add.component.html',
  styleUrls: ['./visa-add.component.css']
})
export class VisaAddComponent {

  visa: Visa = {
    country: '',
    type: '',
    flag: '',
    image: '',
    description: '',
    requirements: [],
    duration: '',
    processingTime: '',
    price: 0
};
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private visaService: VisaService,
    private router: Router
  ) {}

  onSubmit(): void {

    this.loading = true;
    this.errorMessage = '';

    this.visaService.createVisa(this.visa).subscribe({

      next: () => {

        this.loading = false;

        this.router.navigate(['/visas']);

      },

      error: (error) => {

        console.error('Erreur ajout visa :', error);

        this.errorMessage =
          'Impossible d\'ajouter le visa.';

        this.loading = false;

      }

    });

  }
  goBack(): void {
  this.router.navigate(['/visas']);
}

}