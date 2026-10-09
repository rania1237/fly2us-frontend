import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisaService, Visa } from '../../../services/visa.service';


@Component({
  selector: 'app-visa-list',
  standalone: false,
  templateUrl: './visa-list.component.html',
  styleUrls: ['./visa-list.component.css']
})

export class VisaListComponent implements OnInit {


  visas: Visa[] = [];

  loading: boolean = false;

  errorMessage: string = '';



  constructor(
    private visaService: VisaService,
    public router: Router
  ) {}



  ngOnInit(): void {

    this.loadVisas();

  }




  // ==========================
  // Charger les visas
  // ==========================

  loadVisas(): void {


    this.loading = true;


    this.visaService.getAllVisas().subscribe({

      next: (data: Visa[]) => {

        this.visas = data;

        this.loading = false;

      },


      error: (error) => {

        console.error(
          'Erreur chargement visas :',
          error
        );


        this.errorMessage =
        'Impossible de charger les visas.';


        this.loading = false;

      }

    });


  }





  // ==========================
  // Supprimer un visa
  // ==========================

  deleteVisa(id:number):void{


    const confirmation =
    confirm(
      'Voulez-vous vraiment supprimer ce visa ?'
    );


    if(!confirmation){

      return;

    }



    this.visaService.deleteVisa(id)
    .subscribe({


      next:()=>{


        alert(
          'Visa supprimé avec succès'
        );


        this.loadVisas();


      },



      error:(error)=>{


        console.error(
          'Erreur suppression visa :',
          error
        );


        this.errorMessage =
        'Impossible de supprimer le visa.';


      }


    });


  }




  // ==========================
  // Navigation ajout
  // ==========================

  addVisa():void{


    this.router.navigate([
      '/admin/visas/add'
    ]);


  }





  // ==========================
  // Navigation détails
  // ==========================

  detailsVisa(id:number):void{


    this.router.navigate([
      '/admin/visas/details',
      id
    ]);


  }


}