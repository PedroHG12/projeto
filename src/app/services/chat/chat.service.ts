import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterfaceMensagem } from 'src/app/interfaces/interfaceMensagem';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'https://youclass-33tw.onrender.com';

  constructor(private http: HttpClient) { }

usuarioEnviarMensagemAdm(usuario: string, conteudo: string) {
  return this.http.post<any>(`${this.apiUrl}/enviar-adm`, { usuario, conteudo }).subscribe();
}


usuarioBuscarMensagensAdm(nome: string): Observable<InterfaceMensagem[]> {
return this.http.get<InterfaceMensagem[]>(`${this.apiUrl}/administrativa/${nome}`);
}

getMensagensAdministrativas(){
  return this.http.get<any[]>(`${this.apiUrl}/buscar-adm`);
}

async enviarMensagemAdministrativa(usuario: string, conteudo: string): Promise<any> {
  console.log('Enviando mensagem administrativa...');

  try {
    const resposta =  this.http.post<any>(`${this.apiUrl}/adm-enviar-msg`, { usuario, conteudo }).subscribe();
    return resposta;
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${usuario}:`, error);
    throw error; 
  }
}



async enviarMensagensAdministrativasParaTodos(usuarios: string[], conteudo: string) {
  console.log('Enviando mensagens administrativas...');

  await Promise.all(usuarios.map(async (usuario) => {
    try {
      const resposta = this.http.post<any>(`${this.apiUrl}/adm-enviar-msg`, { usuario, conteudo }).subscribe();
      console.log(`Mensagem enviada para ${usuario}: ${conteudo}`);
      return resposta;
    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${usuario}: ${error}`);
      throw error;

    }
  }));
}

excluirMensagemAdministrativa(id: string) {
  return this.http.delete(`${this.apiUrl}/deletar-usuario/`,{
    body: {
      id
    }
  });
}

excluirMensagemRecebidaDoUsuario(id: string) {
  return this.http.delete(`${this.apiUrl}/deletar-adm/`,{
    body: {
      id
    }
  });
}


async buscarMensagensAnteriores() {
  try {
    const resposta =  this.http.get<any[]>(`${this.apiUrl}/anteriores`);
    return resposta;
  } catch (error) {
    console.error(`Erro ao buscar mensagens anteriores:`, error);
    throw error;
    
  }
}

async enviarMensagemGeral(usuario:any,conteudo: string) {
  console.log('Enviando mensagem geral...');

  try {
    const resposta = this.http.post<any>(`${this.apiUrl}/mensagemGeral`, { conteudo, usuario }).subscribe();
    return resposta;
  } catch (error) {
    console.error(`Erro ao enviar mensagem geral:`, error);
    throw error;
  }
  



}




}
