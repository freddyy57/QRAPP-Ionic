
import { Injectable } from '@angular/core';

import { ScanData} from '../../models/scan-data.model';

// Plugins
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { EmailComposer } from '@ionic-native/email-composer';

//modal
import { ModalController, Platform, ToastController } from 'ionic-angular';
import { MapaPage } from '../../pages/mapa/mapa';


@Injectable()
export class HistorialProvider {

  private _historial:ScanData[] = [];

  constructor( private iab: InAppBrowser,
               private modalCtrl: ModalController,
               private contacts: Contacts,
               private platform: Platform,
               private toastCtrl: ToastController,
               private emailComposer: EmailComposer) {}

  agregar_historial( texto:string ) {
    let data = new ScanData( texto );
    // Pongo la data al principio del arreglo
    this._historial.unshift( data );

    console.log( "Historial: ", this._historial );
    // Abrir en navegador el primero de la lista al disparar
    this.abrir_scan(0);
  }

  abrir_scan( index:number ) {
    let scanData = this._historial[index];
    console.log("ScanData: ",scanData);
    switch( scanData.tipo ) {
      case "web":
      this.iab.create(scanData.info, "_system" );
      break;

      case "mapa":
      this.modalCtrl.create( MapaPage, { coords: scanData.info } )
                    .present();
      break;

      case "vcard":
      this.crear_contactoVcard( scanData.info );
      break;

      case "correo":
      let correoArray = scanData.info.split(";");
      let to = correoArray[0].replace("MATMSG:TO:","");
      let sub = correoArray[1].replace("SUB:","");
      let body = correoArray[2].replace("BODY:","");

      console.log(to);
      console.log(sub);
      console.log(body);
      this.enviar_correo(to, sub, body);
      break;

      default:
      console.error("Tipo no soportado");
    }

  }

  private enviar_correo ( to:string, sub:string, body:string ) {
    let email = {
                to: to,
                subject: sub,
                body: body,
                isHtml: false
    };


    if( !this.platform.is('cordova')) {
      this.crear_toast("No está en un dispositivo movóvil, no se puede enviar correo");
      return;
    }

    // this.emailComposer.isAvailable().then((available: boolean) =>{
    //    if(available) {
    //         //Now we know we can send
    //         // Send a text message using default options
    //         console.log(email);
    //         this.emailComposer.open(email);
    //    }
    // },
    // (error) => this.crear_toast("Error: " + error ));

    this.emailComposer.isAvailable().then(() =>{
            //Now we know we can send
            // Send a text message using default options
            console.log(email);
            this.emailComposer.open(email);

    },
    (error) => this.crear_toast("Error: " + error ));

  }

  private crear_contactoVcard( texto:string) {
    let campos:any = this.parse_vcard( texto );
    console.log(campos);

    let nombre = campos['fn'];
    let tel = campos.tel[0].value[0];

    if( !this.platform.is('cordova')) {
      console.log("nombre: ", nombre );
      console.log("teléfono: ", tel );
      console.warn("No estoy en dispositivo móvil, no se puede crear contacto");
      return;
    }

    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, nombre );
    contact.phoneNumbers = [ new ContactField('mobile', tel )];

    contact.save().then(
      () => this.crear_toast("contacto: " + nombre + " Creado"),
      (error) => this.crear_toast("Error: " + error )
    );
  }

  private crear_toast( mensaje:string ) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'middle'
    }).present();
  }


  private parse_vcard( input:string ) {

      var Re1 = /^(version|fn|title|org):(.+)$/i;
      var Re2 = /^([^:;]+);([^:]+):(.+)$/;
      var ReKey = /item\d{1,2}\./;
      var fields = {};

      input.split(/\r\n|\r|\n/).forEach(function (line) {
          var results, key;

          if (Re1.test(line)) {
              results = line.match(Re1);
              key = results[1].toLowerCase();
              fields[key] = results[2];
          } else if (Re2.test(line)) {
              results = line.match(Re2);
              key = results[1].replace(ReKey, '').toLowerCase();

              var meta = {};
              results[2].split(';')
                  .map(function (p, i) {
                  var match = p.match(/([a-z]+)=(.*)/i);
                  if (match) {
                      return [match[1], match[2]];
                  } else {
                      return ["TYPE" + (i === 0 ? "" : i), p];
                  }
              })
                  .forEach(function (p) {
                  meta[p[0]] = p[1];
              });

              if (!fields[key]) fields[key] = [];

              fields[key].push({
                  meta: meta,
                  value: results[3].split(';')
              })
          }
      });

      return fields;
  };


  cargar_historial() {
    return this._historial;
  }

}
