const escpos = require('escpos');
escpos.USB = require('escpos-usb');


export class LPrinter {

  device: any;
  printer: any;
  currentJob: null | Promise<void>;

  constructor() {
    const options = { encoding: "GB18030" }
    
    this.device  = new escpos.USB();
    this.printer = new escpos.Printer(this.device, options);
  }

  queue(text: string) {
    const me = this;

    const register = () => {
      me.currentJob = new Promise<void>((resolve, reject) => {
        me.device.open(function(error){
          me.printer
          .font('a')
          .align('ct')
          .style('bu')
          .size(1, 1)
          .text(text)
          .close(resolve);
        });
      });
    }

    if (this.currentJob == null) {
      register();
      return;
    }

    this.currentJob.finally(register);
  }
}

// const printer = new LPrinter();
// printer.queue('WORD');
// printer.queue('WORD2');