import {Injectable} from '@angular/core';
import {CategoriesTotal, TransactionResult} from '../../shared/shared.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BackendService} from '../../shared/backend.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService extends BackendService {

  constructor(private http: HttpClient) {
    super();
  }

  retrieve(search: string, categoryIds: string[] = [], institutions: string[] = [], startDate: Date, endDate: Date, sortField: string,
           sortDirection: string, pageIndex = 0, pageSize = 10): Observable<TransactionResult> {
    let httpParams = new HttpParams();

    if (search) {
      httpParams = httpParams.append('search', search);
    }
    if (startDate) {
      httpParams = httpParams.append('startDate', `${startDate}`);
    }
    if (endDate) {
      httpParams = httpParams.append('endDate', `${endDate}`);
    }
    if (sortField) {
      httpParams = httpParams.append('sortField', sortField);
    }
    if (sortDirection) {
      httpParams = httpParams.append('sortDirection', sortDirection);
    }
    if (pageIndex) {
      httpParams = httpParams.append('pageIndex', `${pageIndex}`);
    }
    if (pageSize) {
      httpParams = httpParams.append('pageSize', `${pageSize}`);
    }
    categoryIds.forEach(val => httpParams = httpParams.append('category', val));
    institutions.forEach(val => httpParams = httpParams.append('institution', val));
    return this.http.get<TransactionResult>(this.getUrl('/api/transactions'), {
      params: httpParams
    });
  }

  searchDescription(searchString: string): Observable<string[]> {
    const httpParams = new HttpParams()
      .set('q', searchString);
    return this.http.get<string[]>(this.getUrl(`/api/transactions/searchDescription/`), {
      params: httpParams
    });
  }

  aggregateCategoriesForStatement(statemenId) {
    return this.http.get<CategoriesTotal[]>(this.getUrl(`/api/transactions/aggregateCategoriesForStatement/${statemenId}`));
  }

  aggregateCategoriesForYear(year) {
    return this.http.get<CategoriesTotal[]>(this.getUrl(`/api/transactions/aggregateCategoriesForYear/${year}`));
  }
}
