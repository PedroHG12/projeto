import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private menu: MenuController) {}

  openMenu() {
    this.menu.open('main-menu');
  }
}
