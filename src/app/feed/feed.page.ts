import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed/feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  posts: any[] = [];
  newPost = { title: '', content: '', attachment: null as string | null };

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.feedService.posts$.subscribe(posts => {
      this.posts = posts;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPost.attachment = reader.result as string; // Converte para base64
      };
      reader.readAsDataURL(file);
    }
  }

  addPost() {
    if (this.newPost.title && this.newPost.content) {
      this.feedService.addPost(this.newPost); // Adiciona o novo post ao feed
      this.newPost = { title: '', content: '', attachment: null }; // Reseta o formulário
    }
  }

  isImage(file: string): boolean {
    return file.startsWith('data:image');
  }

  isVideo(file: string): boolean {
    return file.startsWith('data:video');
  }
}