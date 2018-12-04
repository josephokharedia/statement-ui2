import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Statement, StatementDetails} from '../../shared/shared.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatementService {

  private statementsSubject = new BehaviorSubject([]);
  private statements$ = this.statementsSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  retrieveDetails(statementId: string) {
    return this.http.get<StatementDetails>(`/api/statements/${statementId}`);
  }

  retrieve(): Observable<Statement[]> {
    this._refresh().subscribe();
    return this.statements$;
  }

  private _refresh(): Observable<Statement[]> {
    return this.http.get<Statement[]>('/api/statements')
      .pipe(tap(v => this.statementsSubject.next(v)));
  }

}
