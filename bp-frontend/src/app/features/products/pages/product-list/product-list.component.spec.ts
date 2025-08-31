import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import {provideRouter} from '@angular/router';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render products in table',()=>{
    fixture.detectChanges();
    const request = httpMock.expectOne(`${environment.apiBase}/bp/products`);
    request.flush({
      data: [
        {id:'productA',
          name:'Product A',
          logo: "test",
          description:'Product A Test',
          date_release:'2025-09-07',
          date_revision:'2026-09-07'
        },
      ]
    });
    fixture.detectChanges();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(rows.length).toBe(1);
    httpMock.verify();
  })
});
