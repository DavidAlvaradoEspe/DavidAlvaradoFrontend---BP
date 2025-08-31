import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import type {CreateProductDto, Product, UpdateProductDto} from '../models/product.model';
import type { Observable} from 'rxjs';
import {catchError} from 'rxjs';
import {map} from 'rxjs';
import {environment} from '../../environments/environment';
import {mapHttpError} from '../utils/http-error.util';
import type {ApiData, ApiDataMessage, ApiMessage} from '../models/api.envelope.model';

@Injectable({providedIn: 'root'})
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBase}/bp/products`;

  getAll(): Observable<Product[]> {
    return this.http.get<ApiData<Product[]>>(this.baseUrl).pipe(
      map((response) => response.data),
      catchError((e) =>mapHttpError(e,'No se pudo obtener los productos')));
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(
      catchError((e)=>mapHttpError(e,'Producto no encontrado'))
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${encodeURIComponent(id)}`)
      .pipe(catchError((e)=>mapHttpError(e,'No se pudo verificar el ID')));
  }

  create(dto: CreateProductDto): Observable<ApiDataMessage<Product>> {
    return this.http.post<ApiDataMessage<Product>>(this.baseUrl, dto).pipe(
      map((response)=>({data: response.data,message: response.message})),
      catchError((e)=>mapHttpError(e,'No se pudo crear el producto'))
    );
  }

  update(id:string, dto: UpdateProductDto): Observable<ApiDataMessage<Product>> {
    return this.http.put<ApiDataMessage<Product>>(`${this.baseUrl}/${encodeURIComponent(id)}`, dto).pipe(
      map((response)=>({data: response.data,message: response.message})),
      catchError((e)=>mapHttpError(e,'No se pudo actualizar el producto'))
    );
  }

  delete(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(
        map(({message})=>({message})),
        catchError((e)=>mapHttpError(e,'No se pudo verificar el ID')));
  }

}
