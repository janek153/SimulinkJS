/**
 * Created by Janek on 2015-04-21.
 */
function TransferFunction(num, den, input, output) {
    var derivativeVars = [];
    var hasDerivativeVars = [];
    var store = null;
    var stateVarsNr = undefined;
    this.parse = function (targetStore) {
        store = targetStore;
        if(den[0] !== 1) {
            changeNumDenValues()
        }
        createVariables();
    };

    function changeNumDenValues() {
        var divisor = den[0];
        num.forEach(function(numValue, index, theArray) {
            theArray[index] = numValue/divisor;
        });
        den.forEach(function(denValue, index, theArray) {
            theArray[index] = denValue/divisor;
        })
    }

    function createVariables() {
        stateVarsNr = den.length - 1;
        for(var i=0; i<stateVarsNr; i++) {
            createStateVariable()
        }
        createLastStateVariable();
        createOutputVariable();
    }

    function createStateVariable() {
        var derivativeVar = new Variable(store);
        var hasDerivativeVar = new Variable(store);
        derivativeVar.derivateType = DerivType.DERIVATIVE;
        derivativeVar.relatedDerivate = hasDerivativeVar;
        hasDerivativeVar.varType = VarType.HAS_DERIVATIVE;
        hasDerivativeVar.currentValue = 0;
        hasDerivativeVar.updateValues();
        hasDerivativeVar.relatedDerivate = derivativeVar;
        if(derivativeVars.length > 0) {
            var previousDerivativeVar = derivativeVars.last();
            previousDerivativeVar.equation = hasDerivativeVar.toString();
            previousDerivativeVar.addVariableInEquation(hasDerivativeVar);
        }
        derivativeVars.push(derivativeVar);
        hasDerivativeVars.push(hasDerivativeVar);
    }

    function createLastStateVariable() {
        var lastDerivativeVar = derivativeVars.last();
        lastDerivativeVar.equation = '';
        var indexOfHasDerivativeVar = 0;
        for(var i=den.length-1; i>0; i--) {
            ai = -den[i];
            if(ai !== 0) {
                var hasDerivativeVar = hasDerivativeVars[indexOfHasDerivativeVar];
                lastDerivativeVar.addVariableInEquation(hasDerivativeVar);
                lastDerivativeVar.equation = lastDerivativeVar.equation + '+' + ai.toString() + '*' + hasDerivativeVar.toString();
            }
            indexOfHasDerivativeVar++;
        }
        lastDerivativeVar.addVariableInEquation(input);
        lastDerivativeVar.equation = lastDerivativeVar.equation + '+' + input.toString();
    }

    function createOutputVariable() {
        output.equation = '';
        var difference = den.length-num.length;
        for(var i=0; i<difference; i++)     {
            num.unshift(0);
        }
        var indexOfHasDerivativeVar = 0;
        for(var i=den.length-1; i>0; i--) {
            var coefficient = num[i];
            if(coefficient !== 0 && coefficient !== undefined) {
                var hasDerivativeVar = hasDerivativeVars[indexOfHasDerivativeVar];
                output.addVariableInEquation(hasDerivativeVar);
                output.equation = output.equation + '+' + coefficient.toString() + '*' + hasDerivativeVar.toString();
            }
            indexOfHasDerivativeVar++;
        }
    }
}

