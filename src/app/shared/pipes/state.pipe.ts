import { Pipe, PipeTransform } from '@angular/core';
import esJson  from "../../../assets/i18n/es.json";

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(value: unknown): unknown {
    if (value) {
      return esJson.nameActive ;
    }
    return esJson.nameInactive;
  }
}
