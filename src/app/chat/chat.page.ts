import { Component, OnInit } from '@angular/core';
import {ChatService} from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }
  
}