import {Injectable} from '@angular/core';
import {CategoriesTotal, TransactionResult} from '../../shared/shared.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private http: HttpClient) {
  }

  retrieve(search: string, categoryIds: string[] = [], fromDate: Date, toDate: Date, sortField: string,
           sortDirection: string, pageIndex = 0, pageSize = 10): Observable<TransactionResult> {
    let httpParams = new HttpParams()
      .set('search', search)
      .set('startDate', `${fromDate}`)
      .set('endDate', `${toDate}`)
      .set('sortField', sortField)
      .set('sortDirection', sortDirection)
      .set('pageIndex', `${pageIndex}`)
      .set('pageSize', `${pageSize}`);

    categoryIds.forEach(val => httpParams = httpParams.append('category', val));
    return this.http.get<TransactionResult>('/api/transactions', {
      params: httpParams
    });
  }

  searchDescription(searchString: string): Observable<string[]> {
    const httpParams = new HttpParams()
      .set('q', searchString);
    return this.http.get<string[]>(`/api/transactions/searchDescription/`, {
      params: httpParams
    });
  }

  aggregateCategoriesForStatement(statemenId) {
    return this.http.get<CategoriesTotal[]>(`/api/transactions/aggregateCategoriesForStatement/${statemenId}`);
  }

  aggregateCategoriesForYear(year) {
    return this.http.get<CategoriesTotal[]>(`/api/transactions/aggregateCategoriesForYear/${year}`);
  }
}
