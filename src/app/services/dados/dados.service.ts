import { Injectable, signal } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { InterfaceMensagem } from 'src/app/interfaces/interfaceMensagem';


@Injectable({
    providedIn: 'root',
  })
  export class Dados {
    public adm = signal(false);
    public resultado = signal(false);
    public usuarioAtual: any;
    public usuarios: any;
    public mensagens: InterfaceMensagem[] = [];
  
    constructor(private firestore: AngularFirestore) {}
  
    public getAdm() {
      return this.adm;
    }
  
    public async PegarIdPorEmail(email: string) {
      const dados = this.firestore
        .collection('usuarios', (ref) => ref.where('email', '==', email))
        .get()
        .toPromise();
      return (await dados)?.docs[0]?.id || undefined;
    }
  
    public async PegarUsuarioPorEmail(email: any) {
      const consulta = await this.firestore
        .collection('usuarios', (ref) => ref.where('email', '==', email))
        .get()
        .toPromise();
  
      return consulta && !consulta.empty ? consulta.docs[0].data() : undefined;
    }
  
    public async PegarTodosUsuarios() {
      const consulta = await this.firestore.collection('usuarios').get().toPromise();
      return consulta?.docs.map((doc) => doc.data()) || [];
    }
  }
  

