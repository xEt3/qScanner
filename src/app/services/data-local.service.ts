import { File as IonFile } from '@ionic-native/file/ngx';
import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ShareService } from './share.service';
import { WifiService } from './wifi.service';
import { WifiViewComponent } from '../components/wifi-view/wifi-view.component';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(
    private storage: Storage, private navController: NavController,
    private iab: InAppBrowser, private shareService: ShareService, private wifiService: WifiService, private modalController: ModalController,private toastController:ToastController) {
    this.cargarRegistros();
  }

  eliminarRegistro(registro: Registro) {
    this.guardados.splice(this.guardados.indexOf(registro), 1);
    this.storage.set('registros', this.guardados);
    this.presentToast("Registro eliminado")
  }

  guardarRegistro(format: string, text: string) {
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    this.storage.set('registros', this.guardados);
    if (nuevoRegistro.type === "wifi") {
      this.wifiService.guardarWifi(nuevoRegistro);
    }
    this.abrirRegistro(nuevoRegistro);
  }

  cargarRegistros() {
    this.storage.get('registros').then(data => {
      if (data != null) {
        this.guardados = data;
      }
    });
  }

  abrirRegistro(registro: Registro) {
    this.navController.navigateForward('tabs/tab2');
    switch (registro.type) {
      case 'http':
        const browser = this.iab.create(registro.text);
        break;
      case 'geo:':
        this.navController.navigateForward(`tabs/tab2/mapa/${registro.text}`)
        break;
      case 'wifi':
        this.abrirWifiView(registro);
        break
    }
  }

  getHistorial(): Registro[] {
    return this.guardados;
  }

  async abrirWifiView(registro:Registro) {
    const modal = await this.modalController.create({
      component: WifiViewComponent,
      componentProps: {
        registro
      }
    });
    return await modal.present();
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
  
}
