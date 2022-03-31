export interface IdType {
    id: string,
    nombre: string
}
  
export interface Department {
    name: string,
    IsoCode: string,
    DaneCode: string,
}
  
export interface Belonging {
    name: string;
}
  
export interface Street {
    name: string;
}
  
export interface City {
    name: string,
    DaneCode: string,
    departmentCode: string,
}