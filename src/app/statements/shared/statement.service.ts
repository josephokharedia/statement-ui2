import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StatementDetailsTo, StatementDraftTo, StatementTo} from '../../shared/shared.model';
import {BackendService} from '../../shared/backend.service';

@Injectable({
  providedIn: 'root'
})
export class StatementService extends BackendService {

  constructor(private http: HttpClient) {
    super();
  }

  retrieveDetails(statementId: string) {
    return this.http.get<StatementDetailsTo>(this.getUrl(`/api/statements/${statementId}`));
  }

  retrieve(): Observable<StatementTo[]> {
    return this.http.get<StatementTo[]>(this.getUrl('/api/statements'));
  }

  retrieveDrafts(): Observable<StatementDraftTo[]> {
    return this.http.get<StatementDraftTo[]>(this.getUrl('/api/draft'));
  }

  retrieveDraftDetails(draftId: string): Observable<StatementDraftTo> {
    return this.http.get<StatementDraftTo>(this.getUrl(`/api/draft/${draftId}`));
  }

  approveDraft(draftId: string): Observable<StatementTo> {
    return this.http.post<StatementTo>(this.getUrl(`/api/draft/approve/${draftId}`), null);
  }

  deleteDraft(draftId: string): Observable<string> {
    return this.http.delete<string>(this.getUrl(`/api/draft/${draftId}`));
  }

  createDraft(institution: string, file: File): Observable<StatementDraftTo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('institution', institution);
    return this.http.post<StatementDraftTo>(this.getUrl(`/api/draft/`), formData);
  }
}
