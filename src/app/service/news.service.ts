import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiUrl = `https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=${environment.NEWS_API_KEY}`;

  constructor(private http: HttpClient) { }

  getNews(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
