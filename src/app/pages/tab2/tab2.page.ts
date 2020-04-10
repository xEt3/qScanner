import { Component } from '@angular/core';
import { Registro } from '../../models/registro.model';
import { ShareService } from '../../services/share.service';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public shareService:ShareService,public dataLocalService:DataLocalService) {}
  
  abrirRegistro(registro:Registro){
    this.dataLocalService.abrirRegistro(registro);
  }
  
  enviaHistorialByMultiplataforma(){
    this.shareService.compartirHistorialMultiplataforma(this.dataLocalService.getHistorial());
  }

  enviarRegistroByMultiplataforma(registro:Registro){
    this.shareService.enviarRegistroSocialMedia(registro)
  }

  eliminarRegistro(registro:Registro){
    this.dataLocalService.eliminarRegistro(registro)
  }

}
