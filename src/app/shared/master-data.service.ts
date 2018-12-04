import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(private http: HttpClient) {
  }

  getInstitutions(): Observable<string[]> {
    return this.http.get<string[]>('/api/institutions');
  }
}
