import { Component, OnInit, ViewChild } from '@angular/core';
import { EconomicActivitiesService } from '../../../../../core/services/setting/economic-activities.service';
import { BasicCatalogsModelEconomicActivity, ResultModel } from '../../../../../core/models/ResultModels';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { BasicCatalogsService } from 'src/app/core/services/setting/basic-catalogs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  idTypes: BasicCatalogsModelEconomicActivity[] = [];

  loading: boolean = true;
  @ViewChild('dt') dt: Table | undefined;
  isSubmitted: boolean = false;
  codeAct: any;
  nameAct: any;

  get code() { return this.basicData.controls['code'].value; }
  get description() { return this.basicData.controls['description'].value; }

  basicData: FormGroup = this.fb.group({
    code: [null, []],
    description: [null, []]
  })

  constructor(private readonly economicActivitiesServices: EconomicActivitiesService, private readonly basicService: BasicCatalogsService,
    private readonly fb: FormBuilder, private readonly router: Router) { }

  ngOnInit(): void {
    this.loadData()

    this.loading = false;

  }

  loadData(): void {
    this.economicActivitiesServices.getEconomicActivities().subscribe({
      next: (resp: ResultModel) => {
        this.idTypes = resp.data;

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  bgInput(controlInput: string, inputType?: boolean): string {
    const control = this.basicData.controls[controlInput];
    if (control.disabled) return 'bg-disabled';
    if (!control.valid && control.touched && inputType && this.isSubmitted) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors' : '';
  }

  next(): void {
    if (!this.basicData.valid) {
      this.basicData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }

  }
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  create() {
    this.router.navigate(["setting/economicActivityCreate"])
  }


}
