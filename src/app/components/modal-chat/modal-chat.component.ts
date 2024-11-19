import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Dados } from 'src/app/services/dados/dados.service';
import { addIcons } from 'ionicons';
import { send,personCircleOutline,closeOutline } from 'ionicons/icons';
import { EfeitosVisuaisService } from 'src/app/services/efeitos/efeitos-visuais.service';

@Component({
  selector: 'app-modal-chat',
  templateUrl: './modal-chat.component.html',
  styleUrls: ['./modal-chat.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ModalChatComponent implements OnInit {
  @Input() usuarioSelecionado: any; 
  novaMensagem: string = ''; 
  foto:any ;
  usuarios :any ;

  constructor( private chat:ChatService,private modalController: ModalController, private buscar:Dados, private efeitos:EfeitosVisuaisService) {
    addIcons({
      send: send,
      personCircleOutline: personCircleOutline,
      closeOutline: closeOutline,
    });
  }

  async ngOnInit() {
    
      this.usuarios = await this.buscar.PegarTodosUsuarios();
      this.foto = this.usuarioSelecionado.foto;  
    
  }

  async enviarMensagem() {
    try{
      this.chat.enviarMensagemAdministrativa(this.usuarioSelecionado.nome, this.novaMensagem);
      this.novaMensagem = '';

      this.efeitos.mostrarToast(true,'Mensagem enviada com sucesso!');
    }
    
    catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      this.efeitos.mostrarToast(false,'Erro ao enviar mensagem!');
    }

  }
  
  fecharModal() {
    this.modalController.dismiss();
  }
}
