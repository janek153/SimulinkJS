/**
 * Created by Janek on 2015-05-05.
 */
function Integrator() {
    this.name = 'integrator0';
    this.type = 'integrator';
    this.inputAnchors = [1];
    this.outputAnchors = [3];
}

Integrator.prototype = new Block();
Integrator.prototype.constructor = Integrator;
