export class ScanData {
  info: string;
  tipo: string;

  constructor( texto: string ) {
    this.tipo = "no definido";
    this.info = texto;

    if( texto.startsWith("http")) {
      this.tipo ="web";
    } else if ( texto.startsWith("geo") ) {
      this.tipo ="mapa";
    } else if ( texto.startsWith("BEGIN:VCARD") ) {
      this.tipo ="vcard";
    } else if ( texto.startsWith("MATMSG:") ) {
      this.tipo ="correo";
    }
  }


}
