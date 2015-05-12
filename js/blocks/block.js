/**
 * Created by Janek on 2015-05-05.
 */

function Block() {
    this.name = 'block';
    this.type = 'block';
    this.anchorLegend = new Immutable.Map({1:'Left', 2:'Top', 3:'Right', 4:'Bottom'});
    this.inputAnchors = [];
    this.outputAnchors = [];
}

Block.prototype.fitBlock = function(ui) {
    var name = this.name;
    setPosition();
    this.makeAnchors();

    function setPosition() {
        $('#'+name).css('top', ui.offset.top);
        $('#'+name).css('left', ui.offset.left);
    }
};

Block.prototype.makeAnchors = function() {
    var anchorLegend = this.anchorLegend;
    var inputs = [];
    var outputs = [];
    if(this.inputAnchors.length > 0) {
        this.inputAnchors.forEach(function (inputAnchor) {
            inputs.push(anchorLegend.get(inputAnchor.toString()))
        });
    }
    this.outputAnchors.forEach(function(outputAnchor) {
        outputs.push(anchorLegend.get(outputAnchor.toString()))
    });
    plumb.addEndpointsInNewBlock(this.name,  outputs, inputs);
};

Block.prototype.rotateLeft = function() {
    plumb.deleteConnectionsInBlock(this.name);
    this.inputAnchors = this.inputAnchors.map(function(inputAnchor) {
        if(inputAnchor>1)
            return --inputAnchor;
        else
            return 4;
    });
    this.outputAnchors = this.outputAnchors.map(function(outputAnchor) {
        if(outputAnchor>1)
            return --outputAnchor;
        else
            return 4;
    });
    this.makeAnchors();
};

Block.prototype.rotateRight = function() {
    plumb.deleteConnectionsInBlock(this.name);
    this.inputAnchors = this.inputAnchors.map(function(inputAnchor) {
        if(inputAnchor<4)
            return ++inputAnchor;
        else
            return 1;
    });
    this.outputAnchors = this.outputAnchors.map(function(outputAnchor) {
        if(outputAnchor<4)
            return ++outputAnchor;
        else
            return 1;
    });
    this.makeAnchors();
};

Block.prototype.editParameters = function() {
    console.log('edit parameters works');
};



