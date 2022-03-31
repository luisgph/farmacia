import { Component, OnInit } from '@angular/core';
import { ResultModel } from '../../core/models/ResultModels';
import { PharmacyService } from '../../core/services/setting/pharmacy.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  constructor(private readonly pharmacySevices: PharmacyService) { }

  ngOnInit(): void {
    const params =
    {
      "codigo":0,
      "nombre":"Name",
      "regional":"N",
      "codigoEmpresa":0,
      "estado":true
    }
    // this.pharmacySevices.getPharmacy(params).subscribe((res: ResultModel) => {
    //   console.log(res);
    // })
  }

}
