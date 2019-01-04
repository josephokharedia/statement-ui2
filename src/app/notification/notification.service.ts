import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AppError, AppErrorType} from '../shared/shared.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  error$: Observable<any | AppError>;
  info$: Observable<any | string>;
  private errorSubject = new Subject();
  private infoSubject = new Subject();

  constructor() {
    this.error$ = this.errorSubject.asObservable();
    this.info$ = this.infoSubject.asObservable();
  }

  displayHttpError({status, statusText, url}) {
    if (status === 0) {
      this.errorSubject.next(new AppError(AppErrorType.OFFLINE_ERROR));
    } else {
      const appError = new AppError(AppErrorType.HTTP_ERROR);
      appError.statusCode = status;
      appError.url = url;
      appError.statusText = statusText;
      this.errorSubject.next(appError);
    }
  }

  displayTechnicalError({summary, detail}) {
    const appError = new AppError(AppErrorType.TECHNICAL_ERROR);
    appError.error = summary;
    appError.possibleReason = detail;
    this.errorSubject.next(appError);
  }

  displayInfo(info: string) {
    this.infoSubject.next(info);
  }

  handleError(error: any) {
    if (this.isTechnicalError(error)) {
      this.displayTechnicalError(error.error.error);
    } else if (this.isHttpError(error)) {
      this.displayHttpError(error);
    }
  }

  private isHttpError(error: any): boolean {
    return error && error.hasOwnProperty('status') && error.hasOwnProperty('statusText');
  }

  private isTechnicalError(error: any): boolean {
    return error && error.hasOwnProperty('error') &&
      error.error.hasOwnProperty('error') &&
      error.error.error.hasOwnProperty('summary') &&
      error.error.error.hasOwnProperty('detail');
  }
}
