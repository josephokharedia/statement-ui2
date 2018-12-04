import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategoriesTotal, Category} from '../../shared/shared.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  create(category: Category): Observable<any> {
    return this.http.post(`/api/categories`, category);
  }

  retrieve(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  update(category: Category): Observable<Category> {
    return this.http.patch(`/api/categories/${category._id}`, category);
  }

  delete(categoryId: string): Observable<Category> {
    return this.http.delete(`/api/categories/${categoryId}`);
  }

}
