import { Component, OnInit, Input } from '@angular/core';
import { Registro } from '../../models/registro.model';
import { ShareService } from '../../services/share.service';
import { DataLocalService } from '../../services/data-local.service';
import { ModalController, AlertController } from '@ionic/angular';
import { WifiService } from '../../services/wifi.service';

@Component({
  selector: 'app-wifi-view',
  templateUrl: './wifi-view.component.html',
  styleUrls: ['./wifi-view.component.scss'],
})
export class WifiViewComponent implements OnInit {

  @Input()registro:Registro;
  ssid:string='';
  passwd:string='';
  auth:string='';
  contrasenaVisible=false;
  
  constructor(private shareService:ShareService,private wifiService:WifiService, private dataLocalSercice:DataLocalService, private modalController:ModalController, private alertController:AlertController) {
   }

  ngOnInit() {
    this.extraerCamposTextoWifi(this.registro.text)
  }

  salir(){
    this.modalController.dismiss();
  }

  async guardarRed() {
    const alert = await this.alertController.create({
      header: 'Guardar Red',
      message: '¿ Desea guardar en su dispositivo la Red '+this.ssid+" ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.wifiService.guardarWifi(this.registro);
          }
        }
      ]
    });
    alert.present()
  }


  compartirSocialMedia(){
    this.shareService.enviarRegistroSocialMedia(this.registro);
  }

  async eliminarRegistro(){
    const alert = await this.alertController.create({
      header: 'Eliminar Registro',
      message: '¿ Seguro que desea eliminar el registro del escaneo ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.dataLocalSercice.eliminarRegistro(this.registro);
            this.modalController.dismiss();
          }
        }
      ]
    });
    alert.present()

  }

  private extraerCamposTextoWifi(texto:string){
    texto = texto.substr(5);
    let propiedades: string[] = texto.split(';');
    propiedades.forEach(propiedad => {
      const camposPropiedad = propiedad.split(':');
      const nombreCampo = camposPropiedad[0];
      const valorCampo = camposPropiedad[1];
      switch (nombreCampo) {
        case 'S':
          this.ssid = valorCampo
          break;
        case 'P':
          this.passwd = valorCampo;
          break;
        case 'T':
          this.auth = valorCampo;
          break;
      }
    });
  }
}
