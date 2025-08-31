import {ProductService} from '../services/products.service';
import {computed, effect, inject, Injectable, signal} from '@angular/core';
import type {Product, UpdateProductDto} from '../models/product.model';
import {finalize} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProductsStore{
  private readonly api = inject(ProductService);

  private _products = signal<Product[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  private _query = signal('');
  private _pageSize = signal(10);
  private _page = signal((0));

  readonly products = computed(()=>this._products());
  readonly loading = computed(()=>this._loading());
  readonly error = computed(()=>this._error());
  readonly query = computed(()=>this._query());
  readonly page = computed(()=>this._page());
  readonly pageSize = computed(()=>this._pageSize());

  readonly filtered = computed(()=>{
    const q = this._query().trim().toLowerCase();
    if(!q) {return this._products();}
    return this._products().filter(p =>
    p.id.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q))
  });

  readonly total = computed(()=>this.filtered().length);
  readonly pageCount = computed(()=>Math.max(1, Math.ceil(this.total() / this._pageSize())));
  readonly pageItems = computed(()=>{
    const ps = this._pageSize();
    const idx = this._page();
    const from = idx * ps;
    return this.filtered().slice(from, from + ps);
  });


  constructor() {
    effect(() => {
      this._query();
      this._pageSize();
      this._page.set(0);
    });
  }

  load(){
    this._loading.set(true);
    this.api.getAll().pipe(finalize(()=>{this._loading.set(false)})).subscribe(
      {
        next: list => {
          this._products.set(list); this._error.set(null);
          },
        error: (err:Error) => {
          this._error.set(err.message)
        },
      }
    )
  }

  setQuery(query:string){this._query.set(query);}

  setPageSize(n:number){this._pageSize.set(n);}

  setPage(page:number){this._page.set(page);}

  add(product:Product){
    this._products.set([product,...this._products()]);
  }

  updateLocal(updated:Product){
    this._products.update(list=>list.map(
      p => p.id === updated.id ? updated : p));
  }

  remove(id:string){
   this._products.update(list=>list.filter(p=>p.id !== id));
  }

  create(product:Product, onDone?: () => void){
    this._loading.set(true);
    this.api.create(product).pipe(finalize(()=>{this._loading.set(false)})).subscribe(
      {
        next: ({data}) => { this.add(data); onDone?.(); },
        error: (err:Error) => {
          this._error.set(err.message)
        }
      }
    )
  }

  save(id:string,dto: UpdateProductDto, onDone?: () => void){
    this._loading.set(true);
    this.api.update(id,dto).pipe(finalize(()=>{this._loading.set(false)})).subscribe(
      {
        next: ({data}) => {
          this.updateLocal({...data,id});
          onDone?.();
        },
        error: (err:Error) => {
          this._error.set(err.message)
        }
      }
    )
  }

  delete(id:string, onDone?: () => void){
    this._loading.set(true);
    this.api.delete(id).pipe(finalize(()=>{this._loading.set(false)})).subscribe(
      {
        next: () => { this.remove(id); onDone?.(); },
        error: (err:Error) => {
          this._error.set(err.message)
        }
      }
    )
  }
}
