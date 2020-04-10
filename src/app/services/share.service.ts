import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Registro } from '../models/registro.model';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { File as IonFile } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private socialSharing: SocialSharing, private emailComposer: EmailComposer, private file: IonFile) { }

  //Registro
  enviarRegistroSocialMedia(registro: Registro) {
    const url = this.getURLFromRegistro(registro);
    switch(registro.type){
      case 'wifi':
        this.compartirRegistroWifiSocialMedia(registro);
        return;
    }
    const message = `Formato: ${registro.format}\nTexto: ${registro.text}\n`
    const options = {
      message, // not supported on some apps (Facebook, Instagram)
      subject: 'Registro scanner', // fi. for email
      url,
    };
    this.socialSharing.shareWithOptions(options).then(console.log);
  }

  private compartirRegistroWifiSocialMedia(registro:Registro){
    const options = {
      message: this.getMensajeRegistroWifi(registro.text), // not supported on some apps (Facebook, Instagram)
      subject: 'Registro scanner', // fi. for email
    };
    this.socialSharing.shareWithOptions(options).then(console.log);
  }

  private getMensajeRegistroWifi(texto: String):string {
    let ssid: string = '';
    let passwd: string = '';
    let auth: string = '';
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
          passwd = valorCampo;
          break;
        case 'T':
          auth = valorCampo;
          break;
      }
    });
    return `SSID: ${ssid}\nContraseña: ${passwd}\nCifrado: ${auth}\n`;
  }

  private getURLFromRegistro(resgistro: Registro): string {
    switch (resgistro.type) {
      case 'geo:':
        let geo: any = resgistro.text.substr(4);
        geo = geo.split(',');
        const lat = Number(geo[0]);
        const lng = Number(geo[1]);
        return this.getStreetViewUrl(lat, lng);
      case 'http':
        return resgistro.text;
      default:
        return '';
    }
  }


  public getStreetViewUrl(lat: number, lng: number) {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=-45&pitch=38&fov=80`
  }





  // Historial

  async compartirHistorialMultiplataforma(hisotrial: Registro[]) {
    const pathFile = await this.crearFicheroCsv(hisotrial, 'registros.csv');
    console.log('ruta',pathFile)
    const options = {
      message: 'Mi historial de Codigos Escaneados con la app qScanner', // not supported on some apps (Facebook, Instagram)
      subject: 'Historial de escaneos', // fi. for email
      files: [pathFile],
    };
    this.socialSharing.shareWithOptions(options).then(() => {
      console.log('compartido');
    }).catch(console.log)
  }


  private async crearFicheroCsv(historial: Registro[], fileName: string) {
    const textoCsv: string = this.generarTextoCsv(historial);
    return await this.crearArchivoFisico(textoCsv, fileName);
  }

  private generarTextoCsv(hisotorial: Registro[]): string {
    const arrTmp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';
    arrTmp.push(titulos);
    hisotorial.forEach(registro => {
      const linea = `${registro.type}, ${registro.format},${registro.created}, ${registro.text.replace(',', ' ')}\n`;
      arrTmp.push(linea);
    })
    return arrTmp.join(' ');
  }

  private async crearArchivoFisico(text: string, nombreFichero: string) {
    
    const existe = await this.file.checkFile(this.file.dataDirectory, nombreFichero).catch(
      console.log
    )
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



}

