import {Component, effect, inject, signal} from '@angular/core';
import type {
  AbstractControl} from '@angular/forms';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsStore} from '../../../../store/products.store';
import {ProductService} from '../../../../services/products.service';
import {uniqueIdValidator} from '../../../../utils/validators/unique-id.async';
import {dateReleaseTodayOrLater, dateRevisionOneYearAfter} from '../../../../utils/validators/product.validator';
import type {Product} from '../../../../models/product.model';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ProductService);
  protected store = inject(ProductsStore);
  private toast = inject(ToastrService);

  private paramId = this.route.snapshot.paramMap.get('id');
  readonly isEdit = signal(!!this.paramId);

  form = this.fb.group({
    id: [
      this.paramId ?? '',
      {
        validators: [
          Validators.minLength(3),
          Validators.maxLength(10),
          (c:AbstractControl)=>Validators.required(c)
        ],
        asyncValidators: this.isEdit() ? []: [uniqueIdValidator(this.api)],
        updateOn: this.isEdit() ? 'change' : 'blur'
      }
    ],
    name: ['',[
      (c:AbstractControl)=>Validators.required(c),
      Validators.minLength(6),
      Validators.maxLength(100)]],
    description: ['',[
      (c:AbstractControl)=>Validators.required(c),
      Validators.minLength(10),
      Validators.maxLength(200)]],
    logo: ['',[(c:AbstractControl)=>Validators.required(c)]],
    date_release: ['',[
      (c:AbstractControl)=>Validators.required(c),
      dateReleaseTodayOrLater()]],
    date_revision: ['',[(c:AbstractControl)=>Validators.required(c)]],
  }, {validators: [dateRevisionOneYearAfter()]});
  constructor() {
    if(this.isEdit()){
      this.form.get('id')?.disable();
      if(this.paramId){
        this.api.getById(this.paramId).subscribe({
          next: (p:Product) => {
            this.form.patchValue(p);
          },
          error: ()=> void this.router.navigateByUrl('/')
        });
      }
      effect(() => {
        const err = this.store.error();
        if(err) {this.toast.error(err);}
      });
    }
    this.form.get('date_release')?.valueChanges.subscribe(v=>{
      if(!v) {return;}
      const d = new Date(v);
      d.setFullYear(d.getFullYear() + 1);
      const iso = d.toISOString().slice(0,10);
      this.form.get('date_revision')?.setValue(iso, {emitEvent: false});
      this.form.updateValueAndValidity({emitEvent: false});
    })
  }

  onReset(){
    this.form.reset(
      this.isEdit() ?
        {id:this.paramId ?? ''}
        : undefined);
  }

  onSubmit() {
    if(this.form.invalid){ this.form.markAllAsTouched(); return;}
    const raw = this.form.getRawValue();
    if(this.isEdit()){
      const {id,...dto} = raw;
      if(id){
        this.store.save(id, dto, ()=> {
          void this.router.navigateByUrl('/').then(
            ()=>{
              this.toast.success('Producto actualizado correctamente')
            }
          )
        });
      }
    }else{
      this.store.create(raw as Product, ()=> {
        void this.router.navigateByUrl('/').then(
          ()=>{
            this.toast.success('Producto creado correctamente')
          }
        )
      } )
    }
  }
}
