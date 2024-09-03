import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseDTO } from '../dto/response.dto';
import { LoginResponseDTO } from '../dto/loginResponse.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `http://localhost:8091/auth-service/api/v1/login`;

  constructor(private http: HttpClient) {}

  login(loginData: { email: string; password: string }): Observable<HttpResponse<ResponseDTO<LoginResponseDTO>>> {
    return this.http.post<ResponseDTO<LoginResponseDTO>>(
      this.apiUrl,
      loginData,
      { observe: 'response' }
    );
  }
}
