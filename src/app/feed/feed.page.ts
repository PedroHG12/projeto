import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  posts: any[] = [];  // Inicialize a variável 'posts' como um array vazio

  constructor() {}

  ngOnInit() {
    // Exemplo de posts. Você pode substituir isso com dados vindos de uma API ou banco de dados.
    this.posts = [
      {
        id: 1,
        content: 'Primeiro post!',
        author: 'João Silva',
        date: '2024-10-11',
      },
      {
        id: 2,
        content: 'Aqui está outro post.',
        author: 'Maria Souza',
        date: '2024-10-10',
      },
      // Adicione mais posts se necessário
    ];
  }
}
