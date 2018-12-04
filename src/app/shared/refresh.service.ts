import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  private refreshSubject = new BehaviorSubject<any>({});
  refresh$: Observable<any> = this.refreshSubject.asObservable();

  constructor() {
  }

  refresh() {
    this.refreshSubject.next({});
  }
}
