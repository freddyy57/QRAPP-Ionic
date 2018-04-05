import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  title:string;
  lat:number;
  lng:number;

  constructor( public navParams: NavParams,
               private viewCtrl: ViewController ) {

    // this.lat = 37.2057552;
    // this.lng = -1.8968664999999874;

    let coordsArray = this.navParams.get("coords").split(",");
     // console.log( this.navParams.get("coords"));
     // console.log( coordsArray[0]);
     // console.log( coordsArray[1]);
    // Quito la palabra geo y la sustituyo por espacio vacío
     this.lat = Number(coordsArray[0].replace("geo:",""));
     this.lng = Number(coordsArray[1]);
  }

  cerrar_modal() {
    this.viewCtrl.dismiss();
  }


}
