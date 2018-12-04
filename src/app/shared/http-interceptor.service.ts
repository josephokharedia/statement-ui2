import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {NotificationService} from './notification.service';
import {catchError} from 'rxjs/operators';

const MAX_ERROR_MESSAGE_LENGTH = 100;
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((err) => {
          // noinspection TsLint
          let {message, detail} = err;
          message = message ? truncate(message) : 'Failed to fetch data. Please contact admin for support';
          this.notificationService.displayError({message, detail}, false);
          return throwError(err);
        }),
      );
  }
}

function truncate(str) {
  if (str.length > MAX_ERROR_MESSAGE_LENGTH) {
    return `${str.substring(0, MAX_ERROR_MESSAGE_LENGTH)}...`;
  } else {
    return str;
  }
}


