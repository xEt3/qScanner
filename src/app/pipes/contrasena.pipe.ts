import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contrasena'
})
export class ContrasenaPipe implements PipeTransform {

  transform(value: string, invisible:boolean): string {
    if(invisible){
      value="*".repeat(value.length);
    }
    return value;
  }

}
