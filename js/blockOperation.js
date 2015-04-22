/**
 * Created by Janek on 2015-04-22.
 */
function BlockOperation(store) {
    this.integral = function(input, output, initialValue) {
        var inputCorrect = input;
        var outputCorrect = output;

        if(input.varType === VarType.HAS_DERIVATIVE) {
            inputCorrect = new Variable(store);
            inputCorrect.equation = input.toString();
            inputCorrect.addVariableInEquation(input);
        }
        else if (output.derivateType === DerivType.DERIVATIVE) {
            outputCorrect = new Variable(store);
            output.equation = outputCorrect.toString();
            output.addVariableInEquation(outputCorrect);
        }
        inputCorrect.derivateType = DerivType.DERIVATIVE;
        inputCorrect.relatedDerivate = outputCorrect;
        outputCorrect.varType = VarType.HAS_DERIVATIVE;
        outputCorrect.currentValue = initialValue;
        outputCorrect.updateValues();
        outputCorrect.relatedDerivate = inputCorrect;
    };

    this.constant = function(variable, value) {
        variable.varType = VarType.CONSTANT;
        for(var t=0; t<=store.simulationParameters.tSim; t+=store.simulationParameters.h) {
            variable.addValues(value);
        }
        variable.currentValue = value;
        variable.equation = value.toString();
    };

    this.output = function(variable) {
        variable.isOutput = true;
    };

    this.sum = function(sumElements, output) {
        output.equation = '';
        sumElements.forEach(function(sumElement) {
            output.addVariableInEquation(sumElement.input);
            output.equation += sumElement.operator + sumElement.input.toString();
        });
    };

    this.gain = function(input, output, multiplier) {
        output.addVariableInEquation(input);
        output.equation = input.toString()+'*'+multiplier;
    };

    this.pid = function(input, output, Kp, Ti, Td, N) {
        var Igain;
        if(Ti === 'inf')
            Igain = 0;
        else
            Igain = 1/Ti;

        var u0 = new Variable(store);
        var u1 = new Variable(store);
        var u2 = new Variable(store);
        var u3 = new Variable(store);
        var u4 = new Variable(store);
        var u5 = new Variable(store);
        var u6 = new Variable(store);
        this.gain(input, u0, Kp);
        this.gain(u0, u1, Igain);
        this.integral(u1, u2, 0);
        var sumElements = [new SumElement(u0, '+'), new SumElement(u2, '+'), new SumElement(u5, '+')];
        this.sum(sumElements, output);
        this.gain(u0, u3, Td);
        var sumElements = [new SumElement(u3, '+'), new SumElement(u6, '-')];
        this.sum(sumElements, u4);
        this.gain(u4, u5, N);
        this.integral(u5, u6, 0);
    };

    this.mathFcn = function(input, output, expression) {
        var finalExpression = expression.replaceAll('u', input.toString());
        output.addVariableInEquation(input);
        output.equation = finalExpression;
    };

    this.step = function(variable, initialValue, finalValue, stepTime) {
        variable.varType = VarType.CONSTANT;
        for(var t=0; t<stepTime; t+=store.simulationParameters.h) {
            variable.addValues(initialValue);
        }
        for(var t=stepTime; t<=store.simulationParameters.tSim; t+=store.simulationParameters.h) {
            variable.addValues(finalValue);
        }
        variable.currentValue = variable.getValues()[0];
        variable.equation = variable.getValues()[0].toString();
    };

    this.sinFnc = function(variable, A, w) {
        variable.varType = VarType.CONSTANT;
        for(var t=0; t<=store.simulationParameters.tSim; t+=store.simulationParameters.h) {
            variable.addValues(A*Math.sin(w*t));
        }
        variable.currentValue = variable.getValues()[0];
        variable.equation = variable.getValues()[0].toString();
    };

    this.pulse = function(variable, A, period, width) {
        variable.varType = VarType.CONSTANT;
        var tempTable = [];
        var tempPeriod = 0;
        var pulseOnTime = width/100*period;
        for(var t=0; t<=store.simulationParameters.tSim; t+=store.simulationParameters.h) {
            if(tempPeriod < pulseOnTime)
                tempTable.push(1);
            else
                tempTable.push(0);
            tempPeriod += store.simulationParameters.h;
            if(tempPeriod >= period)
                tempPeriod = 0;
        }
        tempTable.forEach(function(tempValue) {
            variable.addValues(tempValue*A);
        });
        variable.currentValue = variable.getValues()[0];
        variable.equation = variable.getValues()[0].toString();
    }

}