import { File as IonFile } from '@ionic-native/file/ngx';
import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private socialSharing: SocialSharing, private emailComposer: EmailComposer, private file: IonFile, private storage: Storage, private navController: NavController, private iab: InAppBrowser) {
    this.cargarRegistros();
  }

  guardarRegistro(format: string, text: string) {
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    this.storage.set('registros', this.guardados);
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
    }
  }

  async enviarHistorialByCorreo() {
    const pathFile = await this.crearFicheroCsv('registros.csv');
    this.eviarFicheroToMail(pathFile, 'belmonteperona@gmail.com');
  }

  enviarRegistroSocialMedia(registro: Registro) {
    const url = this.getURLFromRegistro(registro);
    const message=`Formato: ${registro.format}\nTexto: ${registro.text}\n`
    const options = {
      message, // not supported on some apps (Facebook, Instagram)
      subject: 'Registro scanner', // fi. for email
      url,
    };
    this.socialSharing.shareWithOptions(options).then(console.log);
  }

  private getURLFromRegistro(resgistro: Registro): string {
    switch (resgistro.type) {
      case 'geo:':
        let geo: any = resgistro.text.substr(4);
        geo = geo.split(',');
        const lat = Number(geo[0]);
        const lng = Number(geo[1]);
        return this.getStreetViewUrl(lat,lng);
        case 'http':
          return resgistro.text;
      default:
        return '';
    }
  }

  public getStreetViewUrl(lat:number,lng:number){
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=-45&pitch=38&fov=80`
  }

  private async crearFicheroCsv(fileName: string) {
    const textoCsv: string = this.generarTextoCsv();
    return await this.crearArchivoFisico(textoCsv, fileName);
  }

  private generarTextoCsv(): string {
    const arrTmp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';
    arrTmp.push(titulos);
    this.guardados.forEach(registro => {
      const linea = `${registro.type}, ${registro.format},${registro.created}, ${registro.text.replace(',', ' ')}\n`;
      arrTmp.push(linea);
    })
    return arrTmp.join(' ');
  }

  private async crearArchivoFisico(text: string, nombreFichero: string) {
    const existe = await this.file.checkFile(this.file.dataDirectory, nombreFichero)
    if (existe) {
      return await this.escribirEnFichero(text, nombreFichero);
    } else {
      const isCreado = await this.file.createFile(this.file.dataDirectory, nombreFichero, false);
      if (isCreado) {
        return this.escribirEnFichero(text, nombreFichero);
      }
    }
  }

  private async escribirEnFichero(text: string, nombreFichero: string) {
    await this.file.writeExistingFile(this.file.dataDirectory, nombreFichero, text).then();
    return `${this.file.dataDirectory}/${nombreFichero}`;
  }

  eviarFicheroToMail(pathFichero: string, mail: string) {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        let email = {
          to: mail,
          attachments: [
            pathFichero
          ],
          subject: 'Backup Scan',
          body: 'Backup del historial de archivos',
          isHtml: true
        }
        // Send a text message using default options
        this.emailComposer.open(email);
      }
    });
  }


  async compartirHistorialMultiplataforma() {
    const pathFile = await this.crearFicheroCsv('registros.csv');
    const options = {
      message: 'share this', // not supported on some apps (Facebook, Instagram)
      subject: 'the subject', // fi. for email
      files: [pathFile],
    };
    this.socialSharing.shareWithOptions(options).then(() => {
      console.log('compartido');
    }).catch(console.log)
  }

}
