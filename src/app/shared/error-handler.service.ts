import {ErrorHandler, Injectable} from '@angular/core';
import {NotificationService} from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {

  constructor(private notificationService: NotificationService) {
    super();
  }

  handleError(error: any): void {
    super.handleError(error);
    this.notificationService.handleError(error);
  }
}
