import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Ranking } from 'src/app/interfaces/interfaceRanking';
import { Observable, from } from 'rxjs';
import { TimeService } from '../time/time.service';
import { TimeInterface } from 'src/app/interfaces/interfaceTime';
import { InterfaceFeedbacks } from 'src/app/interfaces/intefaceFeedbacks';
import { InterfaceMensagem } from 'src/app/interfaces/interfaceMensagem';
import { EfeitosVisuaisService } from '../efeitos/efeitos-visuais.service';

@Injectable({
  providedIn: 'root',
})
export class Dados {
  public adm = signal(false);
  public resultado = signal(false);
  public times: TimeInterface[] = [];
  public usuarioAtual: any; 
  public usuarios: any; 
  public mensagens: InterfaceMensagem[] = []; 

  constructor(
    private db: Firestore,
    private time: TimeService,
    private efeitos: EfeitosVisuaisService
  ) {}

  public getAdm() {
    return this.adm;
  }

  public async PegarIdPorEmail(email: string) {
    const dados = query(
      collection(this.db, 'usuarios'),
      where('email', '==', email)
    );
    const consulta = await getDocs(dados);
    return !consulta.empty ? consulta.docs[0].id : undefined;
  }

  public async PegarUsuarioPorEmail(email: any) {
    const dados = query(
      collection(this.db, 'usuarios'),
      where('email', '==', email)
    );
    const consulta = await getDocs(dados);

    if (!consulta.empty) {
      return consulta.docs[0].data();
    } else {
      return undefined;
    }
  }

  public async EnviarFeedBack(feedback:InterfaceFeedbacks ) {

    const feedbackBanco = collection(this.db, 'feedbacks');
    return addDoc(feedbackBanco, feedback);
  }

  public async BuscarFeedbacks() {
    const dados = query(collection(this.db, 'feedbacks'));
    const consulta = await getDocs(dados);
    return !consulta.empty ? consulta.docs.map((doc) => doc.data()) : '';
  }


  public async usuarioEstaEmAlgumTime(membro: string) {
    await this.time.PegarTimes().then((resultado: any) => {
      this.times = resultado;
    });

    const timeEncontrado = this.times.find(
      (time) => time.membros && time.membros.includes(membro)
    );
    return timeEncontrado ? timeEncontrado.nome : null;
  }

  public async TimeDoJogador(jogador: string) {
    const time = await this.time.PegarTimes().then((resultado: any) => {
      return resultado.find((time: TimeInterface) =>
        time.membros.includes(jogador)
      );
    });
    return time.nome;
  }

  public async enviarParaRanking(jogador: Ranking) {
    const rankingBanco = collection(this.db, 'ranking');

    try {
      const consulta = query(rankingBanco, where('email', '==', jogador.email));
      const jogadorNoRanking = await getDocs(consulta);

      if (await this.usuarioEstaEmAlgumTime(jogador.nome)) {
        const nomeDoTime = await this.usuarioEstaEmAlgumTime(jogador.nome);
        jogador.time = nomeDoTime || jogador.time;

        await updateDoc(doc(this.db, 'ranking', jogadorNoRanking.docs[0].id), {
          time: jogador.time,
        });
        this.TimeDoJogador(jogador.nome).then(() => {
          if (jogador.time) {
            this.time.AdicionarPontuacaoAoTime(jogador.time, jogador.pontuacao);
            console.log('Pontuação adicionada ao time com sucesso!');
          }
        });
      }

      if (!jogadorNoRanking.empty) {
        const jogadorDoc = jogadorNoRanking.docs[0];
        const novaPontuacao =
          jogadorDoc.data()['pontuacao'] + jogador.pontuacao;
        await updateDoc(jogadorDoc.ref, { pontuacao: novaPontuacao });
      } else {
        await addDoc(rankingBanco, jogador);
        console.log('Jogador adicionado ao ranking com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar/adicionar ao ranking:', error);
      this.efeitos.mostrarToast(false, 'Erro ao atualizar/adicionar ao ranking');
    }
  }

  public async PegarRanking() {
    const dados = query(collection(this.db, 'ranking'));
    const consulta = await getDocs(dados);
    return !consulta.empty ? consulta.docs.map((doc) => doc.data()) : '';
  }


  public async CriarUsuario(dadosUsuario: {
    nome: any;
    email: string;
    senha: string;
    diaCadastro: string;
    bloqueado: boolean;
  }): Promise<boolean> {
    const usuarioExistente = await this.PegarUsuarioPorEmail(dadosUsuario.email);
    const mesmonome = await this.PegarTodosUsuarios().then((resultado: any) => {
      return resultado.some((usuario: any) => usuario.nome === dadosUsuario.nome);
    });
  
    if (mesmonome) {
      this.efeitos.mostrarToast(false, 'O nome já está cadastrado.');
      return Promise.resolve(false);
    }
  
    if (usuarioExistente) {
      this.efeitos.mostrarToast(false, 'O email já está cadastrado.');
      return Promise.resolve(false);
    }
  
    const collectionRef = collection(this.db, 'usuarios');
    await addDoc(collectionRef, dadosUsuario);
    return Promise.resolve(true);
  }

  public AtualizarUsuario(
    id: string,
    dadosUsuario: { nome?: string; email?: string }
  ): Observable<void> {
    const docRef = doc(this.db, 'usuarios', id);
    return from(setDoc(docRef, dadosUsuario, { merge: true }));
  }

  public async DeletarUsuario(id: string): Promise<void> {
    const docRef = doc(this.db, 'usuarios', id);
    await deleteDoc(docRef);
  }

  public async BloquearUsuario(id: string) {
    try {
      const docRef = doc(this.db, 'usuarios', id);
      await setDoc(docRef, { bloqueado: true }, { merge: true });
      console.log('Usuário bloqueado com sucesso!');
      this.efeitos.mostrarToast(true, 'Usuário bloqueado com sucesso!');
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error);
      this.efeitos.mostrarToast(false, 'Erro ao bloquear usuário');
    }
  }

  public async DesbloquearUsuario(id: string) {
    try {
      const docRef = doc(this.db, 'usuarios', id);
      await setDoc(docRef, { bloqueado: false }, { merge: true });
      console.log('Usuário desbloqueado com sucesso!');
      this.efeitos.mostrarToast(true, 'Usuário desbloqueado com sucesso!');
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error);
      this.efeitos.mostrarToast(false, 'Erro ao desbloquear usuário');
    }
  }

  public async PegarTodosUsuarios() {
    const dados = query(collection(this.db, 'usuarios'));
    const consulta = await getDocs(dados);
    return !consulta.empty ? consulta.docs.map((doc) => doc.data()) : '';
  }

  public async VerificarSeEstaBloqueado(email: string) {
    const dados = query(
      collection(this.db, 'usuarios'),
      where('email', '==', email)
    );
    const consulta = await getDocs(dados);
    return !consulta.empty ? consulta.docs[0].data()['bloqueado'] : '';
  }

  public async Administrador(email: string) {
    const dados = query(
      collection(this.db, 'usuarios'),
      where('email', '==', email)
    );
    const consulta = await getDocs(dados);

    if (!consulta.empty) {
      const adm = consulta.docs[0].data()['administrador'];
      return adm === true;
    } else {
      return false;
    }
  }

  public async AdicionarFotoNoUsuario(email: string, foto: string) {
    const dados = query(
      collection(this.db, 'usuarios'),
      where('email', '==', email)
    );
    const consulta = await getDocs(dados);
    if (!consulta.empty) {
      const docRef = doc(this.db, 'usuarios', consulta.docs[0].id);
      await setDoc(docRef, { foto: foto }, { merge: true });
    }
  }
  
  
}
