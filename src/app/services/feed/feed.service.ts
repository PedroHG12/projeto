import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private posts = new BehaviorSubject<any[]>([
    {
      id: 1,
      title: 'Postagem 1',
      content: 'Conteúdo da primeira postagem',
      date: '2024-11-12',
      attachment: null // Campo de anexo (null se não houver)
    },
    {
      id: 2,
      title: 'Postagem 2',
      content: 'Conteúdo da segunda postagem',
      date: '2024-11-11',
      attachment: null
    }
  ]);

  posts$ = this.posts.asObservable();

  constructor() {}

  addPost(post: any) {
    const currentPosts = this.posts.value;
    const newPost = { ...post, id: currentPosts.length + 1, date: new Date().toISOString().split('T')[0] };
    this.posts.next([newPost, ...currentPosts]);
  }
}
