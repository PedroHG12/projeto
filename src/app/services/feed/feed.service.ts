import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'https://youclass-33tw.onrender.com';

  constructor(private http: HttpClient) { }

enviarPostGeral(usuario: string, conteudo: string,title: string, attachment: string) {
  return this.http.post<any>(`${this.apiUrl}/enviar-post`, { usuario, conteudo, title, attachment }).subscribe();
}

getPosts(){
  return this.http.get<any[]>(`${this.apiUrl}/buscar-posts`);
}


}
