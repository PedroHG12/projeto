import { Component } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {

  constructor(private chatService: ChatService) {

    
  }
  mensagens: any

  OnInit(): void {
    
    this.chatService.buscarMensagensAnteriores().then((mensagens) => {
      this.mensagens = mensagens;
    });

    console.log(this.mensagens)

  }

  novaMensagem: string = '';

  enviarMensagem() {
    if (this.novaMensagem.trim()) {
      this.mensagens.push({
        remetente:"jose",
        text: this.novaMensagem,
        timestamp: new Date().toLocaleTimeString(),
        sent: true
      });
      this.novaMensagem = '';
    }
  }
}
