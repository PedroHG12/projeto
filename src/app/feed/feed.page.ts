import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed/feed.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  usuarioAtual :any;
  posts: any[] = [];
  newPost: { usuario:string, title: string; content: string; attachment: string | null } = {
    usuario: '',
    title: '',
    content: '',
    attachment: null,
  };

  constructor(private feedService: FeedService, private authUsuario: AuthService) {}


  async ngOnInit() {

    this.usuarioAtual = await this.authUsuario.buscarUsuario()
    console.log(this.usuarioAtual.nome)


    this.feedService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPost.attachment = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

  addPost() {
    if (this.newPost.content && this.newPost.title) {
      this.feedService.enviarPostGeral(
        this.usuarioAtual.nome,
        this.newPost.content,
        this.newPost.title,
        this.newPost.attachment || '' 
      );
      this.newPost = {usuario:'', title: '', content: '', attachment: null }; 
    }
  }

  isImage(file: string): boolean {
    return file?.startsWith('data:image');
  }

  isVideo(file: string): boolean {
    return file?.startsWith('data:video');
  }
}
