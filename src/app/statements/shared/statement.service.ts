import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StatementDetailsTo, StatementDraftTo, StatementTo} from '../../shared/shared.model';

@Injectable({
  providedIn: 'root'
})
export class StatementService {

  constructor(private http: HttpClient) {
  }

  retrieveDetails(statementId: string) {
    return this.http.get<StatementDetailsTo>(`/api/statements/${statementId}`);
  }

  retrieve(): Observable<StatementTo[]> {
    return this.http.get<StatementTo[]>('/api/statements');
  }

  retrieveDrafts(): Observable<StatementDraftTo[]> {
    return this.http.get<StatementDraftTo[]>('/api/draft');
  }

  retrieveDraftDetails(draftId: string): Observable<StatementDraftTo> {
    return this.http.get<StatementDraftTo>(`/api/draft/${draftId}`);
  }

  approveDraft(draftId: string): Observable<StatementTo> {
    return this.http.post<StatementTo>(`/api/draft/approve/${draftId}`, null);
  }

  deleteDraft(draftId: string): Observable<string> {
    return this.http.delete<string>(`/api/draft/${draftId}`);
  }

  createDraft(institution: string, file: File): Observable<StatementDraftTo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('institution', institution);
    return this.http.post<StatementDraftTo>(`/api/draft/`, formData);
  }
}
