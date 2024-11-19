import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class EfeitosVisuaisService {



  constructor(private toast: ToastController, private controler:AlertController) {}

async mostrarToast(sucesso: boolean,msg: string) {
  const toast = await this.toast.create({
    message: sucesso ? msg : msg,
    duration: 2000,
    color: sucesso ? 'success' : 'danger',
   position: "top",
  });
  await toast.present();
}

    
async mostrarAlerta(mensagem: string) {
  const alert = await this.controler.create({
    header: 'Aviso',
    message: mensagem,
    buttons: ['OK']
  });
  await alert.present();
}


  
}
