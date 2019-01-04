import {Injectable} from '@angular/core';

import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {StatementDraftTo} from '../../shared/shared.model';
import {StatementService} from '../shared/statement.service';
import {of} from 'rxjs';

@Injectable()
export class StatementDraftResolver implements Resolve<Observable<StatementDraftTo> | Observable<null>> {
  constructor(private statementService: StatementService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const draftId = route.queryParams['draft'];
    if (draftId) {
      return this.statementService.retrieveDraftDetails(draftId);
    } else {
      return of(null);
    }
  }
}
