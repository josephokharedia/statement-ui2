import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from '../../shared/shared.model';
import {Observable} from 'rxjs';
import {BackendService} from '../../shared/backend.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BackendService {

  constructor(private http: HttpClient) {
    super();
  }

  create(category: Category): Observable<any> {
    return this.http.post(this.getUrl(`/api/categories`), category);
  }

  retrieve(): Observable<Category[]> {
    return this.http.get<Category[]>(this.getUrl('/api/categories'));
  }

  update(category: Category): Observable<Category> {
    return this.http.patch(this.getUrl(`/api/categories/${category.id}`), category);
  }

  delete(categoryId: string): Observable<Category> {
    return this.http.delete(this.getUrl(`/api/categories/${categoryId}`));
  }

}
