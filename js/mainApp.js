/**
 * Created by Janek on 2015-04-21.
 */
window.onload = function() {
    var store = loadStore6();
    var vars = store.getVariables();
    var solver = new Solver(store);
    solver.solve();
    createChart(solver.getResults());
    console.log(store.getVariableByIndex(2).getValues().toString())
};

function loadStore6() {
    var store = new Store();
    addWires6(store);
    analyzeBlocks6(store);
    return store;
}

function addWires6(store) {
    var var0 = new Variable(store);
    var0.name = "w";
//    var var1 = new Variable(store);
//    var1.name = "e";
    var var1 = new Variable(store);
    var1.name = "u";
    var var2 = new Variable(store);
    var2.name = "y";
}

function analyzeBlocks6(store) {
    var blockOperation = new BlockOperation(store);
    blockOperation.constant(0, 3);
    //add
    var input1 = store.getVariableByIndex(0);
    var input2 = store.getVariableByIndex(2);
    var output = store.getVariableByIndex(1);
    var sumElements = [new SumElement(input1, '+'), new SumElement(input2, '-')];
    blockOperation.sum(sumElements, output);

//    blockOperation.gain(store.getVariableByIndex(1), store.getVariableByIndex(2));
    var transferFunction = new TransferFunction([2, 3], [1, 5, 6], store.getVariableByIndex(1), store.getVariableByIndex(2));
    transferFunction.parse(store);
//    blockOperation.integral(store.getVariableByIndex(1), store.getVariableByIndex(2), 2);
    blockOperation.output(2);
}

function loadStore5() {
    var store = new Store();
    addWires5(store);
    analyzeBlocks5(store);
    return store;
}

function addWires5(store) {
    var var0 = new Variable(store);
    var0.name = "u";
    var var1 = new Variable(store);
    var1.name = "y";
}

function analyzeBlocks5(store) {
    var blockOperation = new BlockOperation(store);
    blockOperation.constant(0, 3);
    blockOperation.output(1);
    var input = store.getVariableByIndex(0);
    var output = store.getVariableByIndex(1);
    var transferFunction = new TransferFunction([2, 3], [1, 5, 6], input, output);
    transferFunction.parse(store);
}

function loadStore() {
    var store = new Store();
    store.addVariables(addWires());
    analyzeBlocks1(store);
    return store;
}

function loadStore2() {
    var store = new Store();
    store.addVariables(addWires2());
    analyzeBlocks2(store);
    return store;
}

function loadStore3() {
    var store = new Store();
    addWires3(store);
    analyzeBlocks3(store);
    return store;
}

function loadStore4() {
    var store = new Store();
    addWires4(store);
    analyzeBlocks4(store);
    return store;
}

function addWires4(store) {
    var var0 = new Variable(store);
    var0.name = "u";
    var var1 = new Variable(store);
    var1.name = "y";
    var var2 = new Variable(store);
    var2.name = "x1'";
    var var3 = new Variable(store);
    var3.name = "x1";
    var var4 = new Variable(store);
    var4.name = "x2'";
    var var5 = new Variable(store);
    var5.name = "x2";
}

function analyzeBlocks4(store) {
    var blockOperation = new BlockOperation(store);
    blockOperation.constant(0, 3);

    //integral1
    var initialValue = 0;
    var input = store.getVariableByIndex(2);
    var output = store.getVariableByIndex(3);
    input.derivateType = DerivType.DERIVATIVE;
    input.relatedDerivate = output;
    output.varType = VarType.HAS_DERIVATIVE;
    output.currentValue = initialValue;
    output.updateValues();
    output.relatedDerivate = input;
    input.variablesInEquation.push(store.getVariableByIndex(5));
    input.equation = store.getVariableInString(5);

    //integral2
    var initialValue = 0;
    var input = store.getVariableByIndex(4);
    var output = store.getVariableByIndex(5);
    input.derivateType = DerivType.DERIVATIVE;
    input.relatedDerivate = output;
    output.varType = VarType.HAS_DERIVATIVE;
    output.currentValue = initialValue;
    output.updateValues();
    output.relatedDerivate = input;
    input.variablesInEquation.push(output, store.getVariableByIndex(3), store.getVariableByIndex(0));
    input.equation = '-6*' + store.getVariableInString(3) + '-5*' + store.getVariableInString(5) + '+' + store.getVariableInString(0);


    blockOperation.output(1);
    var variable = store.getVariableByIndex(1);
    variable.equation = '3*' + store.getVariableInString(3) + '+2*' + store.getVariableInString(5);
    variable.variablesInEquation.push(store.getVariableByIndex(3), store.getVariableByIndex(5));

    //test
    blockOperation.output(3);
    blockOperation.output(5);
}


function addWires2() {
    var var0 = new Variable();
    var0.name = "c'";
    var var1 = new Variable();
    var1.name = "c_d'";
    var var2 = new Variable();
    var2.name = "d";

    var vars = [var0, var1, var2];
    return vars;
}

function addWires3(store) {
    var var0 = new Variable(store);
    var0.name = "w";
    var var1 = new Variable(store);
    var1.name = "e";
    var var2 = new Variable(store);
    var2.name = "y";

}


function analyzeBlocks3(store) {
    var blockOperation = new BlockOperation(store);
    blockOperation.constant(0, 3);
    blockOperation.integral(store.getVariableByIndex(1), store.getVariableByIndex(2), 0);
    blockOperation.output(2);
    //subtract
    var input1 = store.getVariableByIndex(0);
    var input2 = store.getVariableByIndex(2);
    var output = store.getVariableByIndex(1);
    output.variablesInEquation.push(input1, input2);
    output.equation = store.getVariableInString(0)+'-'+store.getVariableInString(2);
}

function analyzeBlocks2(store) {
    var blockOperation = new BlockOperation(store);
    blockOperation.constant(0, 8);
    blockOperation.integral(0, 1, 3);
    blockOperation.integral(1, 2, 6);
    blockOperation.output(1);
    blockOperation.output(0);
    blockOperation.output(2);
}

function BlockOperation(store) {
    this.integral = function(input, output, initialValue) {
        var inputCorrect = input;
        var outputCorrect = output;

        if(input.varType === VarType.HAS_DERIVATIVE) {
            inputCorrect = new Variable();
            inputCorrect.equation = store.getVariableInString(input.index)
        }
        else if (output.varType === DerivType.DERIVATIVE) {
            outputCorrect = new Variable();
            outputCorrect.equation = store.getVariableInString(output.index)
        }
        inputCorrect.derivateType = DerivType.DERIVATIVE;
        inputCorrect.relatedDerivate = outputCorrect;
        outputCorrect.varType = VarType.HAS_DERIVATIVE;
        outputCorrect.currentValue = initialValue;
        outputCorrect.updateValues();
        outputCorrect.relatedDerivate = inputCorrect;
    }

    this.constant = function(input, value) {
        var variable = store.getVariableByIndex(input);
        variable.varType = VarType.CONSTANT;
        for(var t=0; t<=store.simulationParameters.tSim; t+=store.simulationParameters.h) {
            variable.addValues(value);
        }
        variable.currentValue = value;
        variable.equation = value.toString();
    }

    this.output = function(variable) {
        store.getVariableByIndex(variable).isOutput = true;
    }

    this.sum = function(sumElements, output) {
        output.equation = '';
        sumElements.forEach(function(sumElement) {
            output.variablesInEquation.push(sumElement.input);
            output.equation += sumElement.operator + sumElement.input.toString();
        });
    }

    this.gain = function(input, output, multiplier) {
        output.variablesInEquation.push(input);
        output.equation = input.toString()+'*'+multiplier;
    }

}

function SumElement(input, operator) {
    this.input = input;
    this.operator = operator;
}

function addWires() {
    var var0 = new Variable();
    var0.name = "g";
    var var1 = new Variable();
    var1.name = "x'";
    var var2 = new Variable();
    var2.name = "x";
    var var3 = new Variable();
    var3.name = "z";
    var var4 = new Variable();
    var4.name = "a";
    var var5 = new Variable();
    var5.name = "f";
    var var6 = new Variable();
    var6.name = "y";
    var var7 = new Variable();
    var7.name = "y'";
    var var8 = new Variable();
    var8.name = "d";
    var var9 = new Variable();
    var9.name = "e";

    var vars = [var0, var1, var2, var3, var4, var5, var6, var7, var8, var9];
    return vars;
}

function analyzeBlocks1(store) {
    var blockOperation = new BlockOperation();
    blockOperation.integral(1, 2, 2);
    blockOperation.output(2);
    blockOperation.output(9);



    //divide
    var input1 = store.getVariableByIndex(2);
    var input2 = store.getVariableByIndex(3);
    var output = store.getVariableByIndex(1);
    output.variablesInEquation.push(input1, input2);
    output.equation = store.getVariableInString(2)+'*'+store.getVariableInString(3);

    //add
    var input1 = store.getVariableByIndex(4);
    var input2 = store.getVariableByIndex(5);
    var output = store.getVariableByIndex(3);
    output.variablesInEquation.push(input1, input2);
    output.equation = store.getVariableInString(4)+'-'+store.getVariableInString(5);

    //constant
    var constant = 1;
    var variable = store.getVariableByIndex(4);
    variable.varType = VarType.CONSTANT;
    for(var t=0; t<=store.simulationParameters.tSim; t+=store.simulationParameters.h) {
        variable.addValues(constant);
    }
    variable.currentValue = constant;

    //gain
    var gainValue = 1;
    var input = store.getVariableByIndex(6);
    var output = store.getVariableByIndex(5);
    output.variablesInEquation.push(input);
    output.equation = store.getVariableInString(6)+'*'+gainValue;

    //integral2
    var initialValue = 3;
    var input = store.getVariableByIndex(7);
    var output = store.getVariableByIndex(6);
    input.derivateType = DerivType.DERIVATIVE;
    input.relatedDerivate = output;
    output.varType = VarType.HAS_DERIVATIVE;
    output.currentValue = initialValue;
    output.updateValues();
    output.relatedDerivate = input;

    //divide1
    var input1 = store.getVariableByIndex(6);
    var input2 = store.getVariableByIndex(9);
    var output = store.getVariableByIndex(7);
    output.variablesInEquation.push(input1, input2);
    output.equation = store.getVariableInString(6)+'*'+store.getVariableInString(9);

    //constant1
    var constant = 1;
    var variable = store.getVariableByIndex(8);
    variable.varType = VarType.CONSTANT;
    for(var t=0; t<=store.simulationParameters.tSim; t+=store.simulationParameters.h) {
        variable.addValues(constant);
    }
    variable.currentValue = constant;

    //gain1
    var gainValue = 1;
    var input = store.getVariableByIndex(2);
    var output = store.getVariableByIndex(0);
    output.variablesInEquation.push(input);
    output.equation = store.getVariableInString(2)+'*'+gainValue;

    //add1
    var input1 = store.getVariableByIndex(8);
    var input2 = store.getVariableByIndex(0);
    var output = store.getVariableByIndex(9);
    output.variablesInEquation.push(input1, input2);
    output.equation = '-'+store.getVariableInString(8)+'+'+store.getVariableInString(0);
}

function createChart(results) {
    var chartData1 = [];
    for (var i=0; i<results.time.length; i++) {
        chartData1.push({x:results.time[i], y:results.getVariableByIndex(2).getValues()[i]});
    }

    //creating charts
    var chart = new CanvasJS.Chart("realChartDiv",
        {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "v(t), p(t) "
            },
            axisX: {
                title: "t [s]",
                minimum: 0
            },
            axisY: {
                title: "v, p",
                gridThickness: 1
            },
            data: [
                {
                    type: "line",
                    markerType: "none",
                    lineThickness: "1",
                    showInLegend: true,
                    name: "x(t)",
                    dataPoints: chartData1
                }

            ],
            legend: {
                horizontalAlign: "right",
                verticalAlign: "top"
            }
        });
    chart.render();
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
String.prototype.replaceAll = function(replacedStr, newStr) {
    ignoreParenthesisAsSpecialChar();
    var oldExpression = this.valueOf();
    var pattern = new RegExp(replacedStr, "g");
    var newExpression = oldExpression.replace(pattern, newStr);
    return newExpression;

    function ignoreParenthesisAsSpecialChar() {
        var parenthesisPattern1 = new RegExp("\\(", "g");
        replacedStr = replacedStr.replace(parenthesisPattern1, "\\(");
        var parenthesisPattern2 = new RegExp("\\)", "g");
        replacedStr = replacedStr.replace(parenthesisPattern2, "\\)");
    }
};

Object.prototype.extend = function () {
    for (i in arguments) {
        tempObj = new arguments[i];
        for (property in tempObj) {
            this[property] = tempObj[property];
        }
    }
};

Array.prototype.last = function() {
    return this[this.length-1];
};

Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
        return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
        k = n;
    } else {
        k = len + n;
        if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
            (searchElement !== searchElement && currentElement !== currentElement)) {
            return true;
        }
        k++;
    }
    return false;
};

