/**
 * Created by Janek on 2015-05-05.
 */

function TransferFcn() {
    this.name = 'transferFcn0';
    this.type = 'transferFcn';
    this.inputAnchors = [1];
    this.outputAnchors = [3];
}

TransferFcn.prototype = new Block();
TransferFcn.prototype.constructor = TransferFcn;