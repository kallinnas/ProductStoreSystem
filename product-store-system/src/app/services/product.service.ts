import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductDto } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private baseUrl = `${environment.baseURL}/Products`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  addProduct(product: ProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.baseUrl, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
