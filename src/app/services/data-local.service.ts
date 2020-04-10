import { File as IonFile } from '@ionic-native/file/ngx';
import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private emailComposer: EmailComposer, private file: IonFile, private storage: Storage, private navController: NavController, private iab: InAppBrowser) {
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

  enviarCorreo() {
    const arrTmp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';
    arrTmp.push(titulos);
    this.guardados.forEach(registro => {
      const linea = `${registro.type}, ${registro.format},${registro.created}, ${registro.text.replace(',', ' ')}\n`;
      arrTmp.push(linea);
    })
    this.crearArchivoFisico(arrTmp.join(' '), 'registros.csv');
  }

  crearArchivoFisico(text: string, nombreFichero: string) {
    this.file.checkFile(this.file.dataDirectory, nombreFichero).then(existe => {
      console.log('existe', existe);
      return this.escribirEnFichero(text, nombreFichero);
    })
      .catch(err => {
        return this.file.createFile(this.file.dataDirectory, nombreFichero, false)
          .then(creado => { this.escribirEnFichero(text, nombreFichero) })
          .catch(err2 => { console.log })
      });
  }

  async escribirEnFichero(text: string, nombreFichero: string) {
    await this.file.writeExistingFile(this.file.dataDirectory, nombreFichero, text).then();
    const pathFichero = `${this.file.dataDirectory}/${nombreFichero}`;
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        let email = {
          to: 'peronabelmonte@gmail.com',
          cc: 'xet3@outlook.es',
          bcc: ['belmonteperona@gmail.com'],
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

}
