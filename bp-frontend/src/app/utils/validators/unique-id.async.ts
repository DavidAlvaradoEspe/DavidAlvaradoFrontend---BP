import type {ProductService} from '../../services/products.service';
import type {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {catchError, map, of, switchMap, timer} from 'rxjs';

export function uniqueIdValidator(api:ProductService, debounceMs = 400): AsyncValidatorFn {
  return (control:AbstractControl) =>{
    let id = '';
    if(control.value){
      id = (control.value as string).trim();
    }
    if(!id) {return of<ValidationErrors |null>({required:true});}
    return timer(debounceMs).pipe(
      switchMap(()=>{
        return api.verifyId(id);}),
      map(exists =>(exists ? {idTaken:true}:null)),
      catchError(() => of<ValidationErrors | null>({server: true}),)
    )

  }
}
