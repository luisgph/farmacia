export interface ResultModel {
  data: any;
  status: number,
  isSuccess: boolean,
  successMessage: string,
  errors: any,
  validationErrors: any
}

export interface BasicCatalogsModel {
  id: number;
  nombre: string,
  estado: boolean,
  idAplicacion: number,
  nombreAplicacion: string
}

export interface BasicCatalogsModelEconomicActivity {
  id: number,
  codigo: string,
  nombre: string
}

export interface BasicCatalogsModelRegimeType{
    id : number,
    codigo : string,
    nombre : string,
    estado: boolean,
    observacion?: string
}

export interface DataSelect {
  id: number,
  nombre: string,
  codigoDane?: string,
  codigoIso?: string
}

export interface CatalogPharmacy {
  id: number,
  codigo: number,
  nombre: string,
  estado: boolean
}

export interface DataFile {
  nameFile: string,
  ContentType: string,
  Filebyt64: string
}

export interface IvaRatesModel {
  id: number,
  tarifa: number,
  symbol: string,
  cuentaContable: string
}

export interface Taxes {
  id: number,
  nombre: string,
  estado: boolean,
  idAplicacion: number,
  observacion: string,
  ciudades: any, 
  departamentos: any
}
