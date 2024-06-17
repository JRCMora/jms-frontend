import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  private apiUrl = 'https://jms-backend-testing.vercel.app'; // Update with your backend base URL

  constructor(private http: HttpClient) { }

  // Method to fetch all journals from the server
  getJournals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/journals`);
  }

  // Method to submit a new journal to the server
  submitJournal(journalData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/journals`, journalData);
  }

// Method to assign multiple reviewers to a journal
assignReviewers(journalId: string, reviewerIds: string[], rubricId: string): Observable<any> {
  const data = { journalId, reviewerIds, rubricId };
  return this.http.post<any>(`${this.apiUrl}/journals/${journalId}/assign-reviewers`, data);
}


// Method to fetch assigned journals for a specific reviewer
getAssignedJournals(userId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/user/reviewers/${userId}/assigned-journals`);
}

// Method to fetch a single journal by its ID
getJournalById(journalId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/journals/${journalId}`);
}

submitFeedback(journalId: string, feedback: string, choice: string, userId: string): Observable<any> {
  const data = { feedback, choice, userId }; // Include userId in the data to be sent
  return this.http.post<any>(`${this.apiUrl}/journals/${journalId}/submit-feedback`, data);
}


//  Method to fetch journals submitted by a specific user:
getJournalsByUser(userId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/journals`);
}

deleteJournal(journalId: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/journals/${journalId}`);
}

updateJournalStatus(journalId: string, status: string): Observable<any> {
  const data = { status };
  return this.http.put<any>(`${this.apiUrl}/journals/${journalId}/update-status`, data);
}

getConsolidateFeedback(journalId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/journals/${journalId}/consolidate-feedback`);
}

submitConsolidatedFeedback(journalId: string, consolidatedFeedback: string, adminChoice: string): Observable<any> {
  const data = { consolidatedFeedback, adminChoice }; // Include admin choice in the data to be sent
  return this.http.post<any>(`${this.apiUrl}/journals/${journalId}/submit-consolidated-feedback`, data);
}

getConsolidatedFeedback(journalId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/journals/${journalId}/consolidated-feedback`);
}

publishJournal(journalId: string, updatedData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/journals/${journalId}`, updatedData);
}

getJournalStatusStatistics(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/journal-status-statistics`);
}

}
