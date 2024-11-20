import { Injectable, signal } from '@angular/core';
import { getAuth, User } from 'firebase/auth';
import { Dados } from '../dados/dados.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioAtual: User | null = null;
  public autenticado = signal(false);
  public fotoUsuario = signal('');

  constructor(private dados: Dados) { }

  async buscarUsuario() { 
    return new Promise((resolve) => { 
      const auth = getAuth();
      auth.onAuthStateChanged(async (user) => {

        if (user) {
          const usuario = await this.dados.PegarUsuarioPorEmail(user.email); 
          if(usuario){

            this.usuarioAtual = user; 
            resolve(usuario); 
          }
        } else {
          this.usuarioAtual = null; 
          this.deslogar(); 
        }
      }
    )})
  }
  setAutenticado(autenticado: boolean) {
    this.autenticado.set(autenticado);
  }
  getAutenticado() {
    return this.autenticado();
  }
  async deslogar() {
    try {
      const auth = getAuth();
      await auth.signOut();
      this.autenticado.set(false);
      
      
      
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }
}

