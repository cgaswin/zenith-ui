import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../dto/response.dto';
import { RegistrationResponseDTO } from '../dto/registrationResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = `http://localhost:8091/auth-service/api/v1/register`;

  constructor(private http: HttpClient) {}

  signup(formData: FormData): Observable<HttpResponse<ResponseDTO<RegistrationResponseDTO>>> {
    return this.http.post<ResponseDTO<RegistrationResponseDTO>>(
      this.apiUrl,
      formData,
      { observe: 'response' }
    );
  }

}