/**
 * Created by Janek on 2015-05-05.
 */
function Plumb() {
    this.plumbInstance = null;
    this.sourceEndpoint = null;
    this.targetEndpoint = null;

    jsPlumb.ready(function () {

        plumbInstance = jsPlumb.getInstance({
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            ConnectionOverlays: [
                [ "Arrow", { location: 1 } ]
            ],
            Container: "modelPaneContent"
        });

        var basicType = {
            connector: "Flowchart",
            paintStyle: { strokeStyle: "#000000" },
            hoverPaintStyle: { strokeStyle: "#000000" }


        };
        plumbInstance.registerConnectionType("basic", basicType);

        var connectorPaintStyle = {
            lineWidth: 3,
            strokeStyle: "#474747",
            outlineColor: "white",
            outlineWidth: 1
        };
        var connectorHoverStyle = {
            lineWidth: 3,
            strokeStyle: "#000000",
            outlineWidth: 1,
            outlineColor: "white"
        };
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                fillStyle: "#474747",
                strokeStyle: "#474747",
                radius: 5,
                lineWidth: 2
            },
            isSource: true,
            connector: [ "Flowchart", { gap: 3 } ],
            connectorStyle: connectorPaintStyle,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {}
        };
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                strokeStyle: "#474747",
                fillStyle: "transparent",
                radius: 5,
                lineWidth: 2
            },
            maxConnections: -1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true
        };

        plumbInstance.batch(function () {

            plumbInstance.bind("dblclick", function (conn) {
                plumbInstance.detach(conn);
            });

            plumbInstance.bind("connectionDrag", function (connection) {
                console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
            });

            plumbInstance.bind("connectionDragStop", function (connection) {
                console.log("connection " + connection.id + " was dragged");
            });

            plumbInstance.bind("connectionMoved", function (params) {
                console.log("connection " + params.connection.id + " was moved");
            });
        });
    });
}

Plumb.prototype.addEndpointsInNewBlock = function (toId, outputs, inputs) {
    for (var i = 0; i < outputs.length; i++) {
        plumbInstance.addEndpoint(toId, sourceEndpoint, {
            anchor: outputs[i]
        });
    }
    for (var j = 0; j < inputs.length; j++) {
        plumbInstance.addEndpoint(toId, targetEndpoint, {
            anchor: inputs[j]
        });
    }
    plumbInstance.draggable(jsPlumb.getSelector('#'+toId));
};

Plumb.prototype.deleteConnectionsInBlock = function(name) {
    plumbInstance.detachAllConnections(name);
    var allEndPoints = plumbInstance.getEndpoints(name);
    allEndPoints.forEach(function (endPoint) {
        plumbInstance.deleteEndpoint(endPoint);
    });
};

Plumb.prototype.getAllConnections = function() {
    return plumbInstance.getConnections();
};

Plumb.prototype.getAllEndpoints = function(name) {
    return plumbInstance.getEndpoints(name);
};

