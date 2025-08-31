import type { OnInit} from '@angular/core';
import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ProductsStore} from '../../../../store/products.store';
import type {Product} from '../../../../models/product.model';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogComponent} from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  imports: [
    FormsModule,
    ConfirmDialogComponent
  ],
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
   private readonly router = inject(Router);
   readonly store = inject(ProductsStore);

   readonly menuOpenFor = signal<string | null>(null);
   readonly confirmOpen = signal(false);
   readonly selected = signal<Product | null>(null);


  ngOnInit() {
     if(this.store.products().length === 0){
       this.store.load();
     }
  }

  onSearch(target:(EventTarget | null)){
    if(!target){return;}
    const el = target as HTMLInputElement;
    const searchTerm = el.value;
     this.store.setQuery(searchTerm);
  }

  onChangePageSize(target:(EventTarget | null)){
    if(!target){return;}
    const el = target as HTMLInputElement;
    const size = +el.value;
    this.store.setPageSize(size);
  }

  prev() { this.store.setPage(this.store.page() - 1)}

  next() { this.store.setPage(this.store.page() + 1)}

  newProduct(){
    this.router.navigateByUrl('/products/new').catch(console.error);
  }

  updateProduct(p: Product){
    this.router.navigateByUrl(`/products/${p.id}/edit`).catch(console.error);
  }

  openMenuFor(id:string){
    this.menuOpenFor.set(this.menuOpenFor() === id ? null : id);
  }

  closeMenu(){
    this.menuOpenFor.set(null);
  }

  askDelete(p:Product){
    this.selected.set(p);
    this.confirmOpen.set(true);
    this.closeMenu();
  }
  doDelete(p:(Product | null)){
    if(!p){return;}
    this.store.delete(p.id);
    this.confirmOpen.set(false);
  }
}
