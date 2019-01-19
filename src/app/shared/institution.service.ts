import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InstitutionTo} from './shared.model';
import {BackendService} from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService extends BackendService {

  constructor(private http: HttpClient) {
    super();
  }

  retrieve(): Observable<InstitutionTo[]> {
    return this.http.get<InstitutionTo[]>(this.getUrl('/api/institutions'));
  }
}
