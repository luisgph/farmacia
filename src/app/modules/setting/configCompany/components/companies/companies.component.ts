import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {  
  items: MenuItem[] = [];
  activeIndex = 0;

  mainTxt: string;
  componentActive: string;
  stateActive: string;

  companyId: string | null;

  constructor( private readonly activatedRouter: ActivatedRoute, private readonly router: Router ) {
    this.router.events.subscribe(( val: any ) => {
      if ( val instanceof NavigationEnd ) {
        const url = val.url;
        const splitUrl = url.split("/");
        this.componentActive = splitUrl[3];
        this.stateActive = splitUrl[4];

        this.items = [
          { label: 'Datos básicos', routerLink: 'basicInformation', styleClass: (this.componentActive === 'contactInformation' || this.componentActive === 'tributaryInformation') ? 'boxSteps-active' : '' },
          { label: 'Datos de contacto', routerLink: 'contactInformation', styleClass: (this.componentActive === 'tributaryInformation') ? 'boxSteps-active' : '' },
          { label: 'Información tributaria', routerLink: 'tributaryInformation' },
        ];
      }
    });
  }

  ngOnInit(): void {
    this.mainTxt = (this.stateActive === 'edit') ? 'Actualización empresa' : 'Creación empresa';    
  }

}
