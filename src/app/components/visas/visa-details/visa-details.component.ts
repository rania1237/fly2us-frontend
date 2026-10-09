import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisaService, Visa } from '../../../services/visa.service';

@Component({
  selector: 'app-visa-details',
  standalone: false,
  templateUrl: './visa-details.component.html',
  styleUrls: ['./visa-details.component.css']
})
export class VisaDetailsComponent implements OnInit {
    visa: Visa | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private visaService: VisaService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.visaService.getVisaById(Number(id)).subscribe({
                next: (data: Visa) => {
                    this.visa = data;
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/visas']);
    }
}