/**
 * Created by Janek on 2015-05-11.
 */
function Scope() {
    this.name = 'scope0';
    this.type = 'scope';
    this.inputAnchors = [1];
}

Scope.prototype = new Block();
Scope.prototype.constructor = Scope;
