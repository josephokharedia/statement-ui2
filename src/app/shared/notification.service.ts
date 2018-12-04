import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AppError} from './shared.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  error$: Observable<AppError>;
  info$: Observable<string>;
  private errorSubject = new BehaviorSubject(null);
  private infoSubject = new BehaviorSubject(null);

  constructor() {
    this.error$ = this.errorSubject.asObservable();
    this.info$ = this.infoSubject.asObservable();
  }

  displayError(error: AppError, dismissable = true) {
    this.errorSubject.next(Object.assign({}, error, {dismissable}));
  }

  displayInfo(info: string) {
    setTimeout(() => this.infoSubject.next(info));
  }

  dismissInfo() {
    setTimeout(() => this.infoSubject.next(null));
  }
}
