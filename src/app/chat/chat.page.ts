import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  usuario:any

  constructor(private chatService: ChatService, private auth: AuthService) {

    
  }
  mensagens: any

  async ngOnInit(){
    await this.auth.buscarUsuario().then((usuario) => {
      this.usuario = usuario
    })

    console.log(this.usuario)
    
    await (await this.chatService.buscarMensagensAnteriores()).forEach((mensagem) => {
      this.mensagens = mensagem
    }
    )

  }

  novaMensagem: string = '';

  enviarMensagem() {

    if (this.novaMensagem.trim()) {
      this.chatService.enviarMensagemGeral(this.usuario.nome, this.novaMensagem)
      this.novaMensagem = '';
    }
  }
}
