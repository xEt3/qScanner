import { Injectable } from '@angular/core';
import { Hotspot } from '@ionic-native/hotspot/ngx';
import { Registro } from '../models/registro.model';
import { ToastController, AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class WifiService {

  constructor( private hotsPot: Hotspot, private toastController:ToastController, private alertController:AlertController) { }


  async guardarWifi(registro: Registro) {
    console.log("guardando wifi")
    let ssid = '';
    let auth = '';
    let pass = '';
    let texto= registro.text;
    texto = texto.substr(5);
    let propiedades: string[] = texto.split(';');


    propiedades.forEach(propiedad => {
      const camposPropiedad = propiedad.split(':');
      const nombreCampo = camposPropiedad[0];
      const valorCampo = camposPropiedad[1];
      switch (nombreCampo) {
        case 'S':
          ssid = valorCampo
          break;
        case 'P':
          pass = valorCampo;
          break;
        case 'T':
          auth = valorCampo;
          break;
      }
    });
    this.hotsPot.addWifiNetwork(ssid, auth, pass).then(() => {
        this.presentToast(`Red ${ssid} guardada con exito`);
    })
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }




}
