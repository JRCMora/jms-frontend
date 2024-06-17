import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RubricService {
  private apiUrl = 'https://jms-backend-testing.vercel.app'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  createRubric(rubricData: any): Observable<any> { // Change the type to 'any'
    return this.http.post<any>(`${this.apiUrl}/rubrics`, rubricData); // Remove array brackets
  }

  getRubrics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rubrics`);
  }
  
  getRubricById(rubricId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rubrics/${rubricId}`);
  }
  
  deleteRubrics(rubricId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/rubrics/${rubricId}`);
  }
}
