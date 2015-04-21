/**
 * Created by Janek on 2015-04-21.
 */
var VarType = {
    VARIES: 0,
    CONSTANT: 1,
    HAS_DERIVATIVE: 2
};

var DerivType = {
    NOT_DERIVATIVE: 0,
    DERIVATIVE: 1
};

function SimulationParameters() {
    this.h = 1;
    this.tSim = 20;
}

function Store() {
    var variables = [];
    this.simulationParameters = new SimulationParameters();

    this.addVariable = function(variable) {
        variable.index = variables.length;
        variables.push(variable);
    };

    this.addVariables = function(variablesTable) {
        for(var i=0; i<variablesTable.length; i++) {
            variablesTable[i].index = variables.length;
            variables.push(variablesTable[i]);
        }
    };

    this.getVariableByName = function(name) {
        return searchVariable(name);
    };

    this.getVariables = function() {
        return variables;
    };

    this.getVariableByIndex = function(index) {
        return variables[index];
    };

    var searchVariable = function (name) {
        for (var i = 0; i < variables.length; i++) {
            if (variables[i].name === name)
                return variables[i];
        }
    };

    this.getVariableInString = function(index) {
        var template = 'store.getVariableByIndex('+index+').currentValue';
        return template;
    }
}

function Variable(store) {
    this.index = undefined;
    this.derivateType = DerivType.NOT_DERIVATIVE;
    this.varType = VarType.VARIES;
    this.relatedDerivate = null;
    this.variablesInEquation = [];
    this.equation = null;
    this.constEquation = null;
    this.isOutput = false;
    this.name = null;
    this.currentValue = undefined;
    this.updateValues = function() {
        values.push(this.currentValue);
    };
    this.addValues = function() {
        for(var i=0; i<arguments.length; i++) {
            values.push(arguments[i]);
        }
    };
    this.getValues = function () {
        return values;
    };
    this.restoreEquation = function() {
        this.equation = this.constEquation;
    };
    this.toString = function() {
        return 'store.getVariableByIndex('+this.index+').currentValue';
    };
    var values = [];
    store.addVariable(this);
}