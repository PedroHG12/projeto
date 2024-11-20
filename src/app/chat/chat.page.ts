import { Component } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {

  usuario:any

  constructor(private chatService: ChatService, private auth: AuthService) {

    
  }
  mensagens: any

  OnInit(): void {
    this.usuario = this.auth.usuarioAtual
    
    this.chatService.buscarMensagensAnteriores().then((mensagens) => {
      this.mensagens = mensagens;
    });

    console.log(this.mensagens)

  }

  novaMensagem: string = '';

  enviarMensagem() {

    if (this.novaMensagem.trim()) {
      this.chatService.enviarMensagemGeral(this.usuario, this.novaMensagem)
      this.novaMensagem = '';
    }
  }
}
