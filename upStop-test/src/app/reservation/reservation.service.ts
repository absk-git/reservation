import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const baseUrl = 'http://localhost:3000/api/coaches';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  fetchSeats() {
    return this.http.get<any>(baseUrl).pipe(
      map((res:any) => {
        return res[0];
      }),
      (err: any) => {
        return err;
      }
    );
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/${id}`, data).pipe(
      map((res: any) => {
        return res;
      }),
      (err: any) => {
        return err;
      })
  }
}
