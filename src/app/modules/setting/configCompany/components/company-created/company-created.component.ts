import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CompaniesService } from '../../../../../core/services/setting/companies.service';

@Component({
  selector: 'app-company-created',
  templateUrl: './company-created.component.html',
  styleUrls: ['./company-created.component.scss']
})
export class CompanyCreatedComponent implements OnInit {
  idCompany: string | null;
  companyInfo: any;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly companiesService: CompaniesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(( params ) => {
      this.idCompany = params.get('idCreated');
    });

    const dataToFilter = {
      id: this.idCompany,
      nombre: '',
      numeroIdentificacion: '',
      idCiudad: 0,
      idDepartamento: 0,
      idTipoEmpresa: 0,
      idTipoRegimen: 0,
      idActividadEconomica: 0,
      fechaRegistro: '',
      estado: 1,
    };

    this.companiesService.getCompany( dataToFilter ).subscribe({
      next: ( resp ) => {
        this.companyInfo = resp.data[0];
        console.log(resp);
        
      }
    });
  }

}
