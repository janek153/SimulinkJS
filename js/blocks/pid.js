/**
 * Created by Janek on 2015-05-05.
 */

function Pid() {
    this.name = 'pid0';
    this.type = 'pid';
    this.inputAnchors = [1];
    this.outputAnchors = [3];
}

Pid.prototype = new Block();
Pid.prototype.constructor = Pid;
