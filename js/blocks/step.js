/**
 * Created by Janek on 2015-05-04.
 */

function Step() {
    this.name = 'step0';
    this.type = 'step';
    this.outputAnchors = [3];
}

Step.prototype = new Block();
Step.prototype.constructor = Step;

