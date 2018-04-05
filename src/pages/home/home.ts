import { Component } from '@angular/core';
import { ToastController, Platform } from 'ionic-angular';
// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


// servicios
import { HistorialProvider } from '../../providers/historial/historial'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController,
              private platform: Platform,
              private _historialService: HistorialProvider) {}

  scan() {
    console.log("realizando Scan...");

    if( !this.platform.is('cordova')) {
       // this._historialService.agregar_historial("https://google.com");

       // this._historialService.agregar_historial("geo:37.2057552,-1.8968664999999874");

//        this._historialService.agregar_historial( `BEGIN:VCARD
// VERSION:2.1
// N:Kent;Clark
// FN:Clark Kent
// ORG:
// TEL;HOME;VOICE:12345
// TEL;TYPE=cell:67890
// ADR;TYPE=work:;;;
// EMAIL:clark@superman.com
// END:VCARD` );
this._historialService.agregar_historial("MATMSG:TO:alfredoleyzaola@gmail.com;SUB:Prueba Ionic;BODY:Esto es una prueba de ionic;;");

       return;
    }

    this.barcodeScanner.scan().then((barcodeData) => {
     // Success! Barcode data is here
     // console.log( "Data del Scan", barcodeData );
     console.log( "result:", barcodeData.text );
     console.log( "format:", barcodeData.format );
     console.log( "cancelled", barcodeData.cancelled );

     if ( barcodeData.cancelled == false && barcodeData.text != null ) {
       this._historialService.agregar_historial(barcodeData.text);
     }
      }, (err) => {
      // An error occurred
      console.error("Error", err);
      this.mostrarError("Error " + err);
      });
  }

  mostrarError( mensaje: string ) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'middle'
    });
    toast.present();
  }

}
