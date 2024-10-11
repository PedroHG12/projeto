import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redireciona a rota padrão para 'login'
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'cadastro', loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroPageModule) },
  { path: 'feed', loadChildren: () => import('./feed/feed.module').then(m => m.FeedPageModule) },
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule) },
  { path: 'equipe', loadChildren: () => import('./equipe/equipe.module').then(m => m.EquipePageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
