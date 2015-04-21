/**
 * Created by Janek on 2015-04-21.
 */
/**
 * Created by Janek on 2014-12-06.
 */

function Solver(store) {
    var filterVar = new filterVariables();
    var derivateVars = filterVar.getDerivateVars();
    var constantVars = filterVar.getConstantVars();
    var results = new Results();
    results.addVariables(filterVar.getOutputVars());
    var isUnknownVariable = true;
    while(isUnknownVariable) {
        isUnknownVariable = false;
        replaceUnknownVariables(derivateVars);
    }

    this.getResults = function() {
        return results;
    };

    function filterVariables() {
        this.getDerivateVars = function() {
            return derivateVars;
        };
        this.getOutputVars = function() {
            return outputVars;
        };
        this.getConstantVars = function() {
            return constantVars;
        };
        var derivateVars = [];
        var outputVars = [];
        var constantVars = [];
        store.getVariables().forEach(function(variable) {
            if(variable.derivateType === DerivType.DERIVATIVE) {
                derivateVars.push(variable);
            }
            if(variable.isOutput) {
                outputVars.push(variable);
            }
            if(variable.varType === VarType.CONSTANT) {
                constantVars.push(variable);
            }
        });
    }

    function replaceUnknownVariables(derivateVars) {
        derivateVars.forEach(function(variable) {
            checkVariesVariable(variable);
        });
    }

    function checkVariesVariable(variable) {
        variable.variablesInEquation.forEach(function(varInEquation){
            if (varInEquation.varType === VarType.VARIES) {
                isUnknownVariable = true;
                replaceVariableByValue(variable, varInEquation);
            }
        });
        variable.constEquation = variable.equation;
    }

    function replaceVariableByValue(variable, oldVarInEquation) {
        var indexToRemove = variable.variablesInEquation.indexOf(oldVarInEquation);
        var variablesInEquation = variable.variablesInEquation;
        variablesInEquation.splice(indexToRemove, indexToRemove);
        var variablesInEquationToAdd = oldVarInEquation.variablesInEquation;
        variablesInEquationToAdd.forEach(function(variableInEquationToAdd) {
            if(!variablesInEquation.includes(variableInEquationToAdd))
                variablesInEquation.push(variableInEquationToAdd);
        });
        variable.equation = variable.equation.replaceAll(store.getVariableInString(oldVarInEquation.index), '('+oldVarInEquation.equation+')');
    }

    this.solve = function() {
        var h = store.simulationParameters.h;
        var tSim = store.simulationParameters.tSim;

        var test = store.getVariables();

        var index = 1;
        for(var t=h; t<=tSim; t += h) {
            constantVars.forEach(function(constantVar) {
                constantVar.currentValue = constantVar.getValues()[index];
            });
            results.time.push(t);
            nextStepRungeKuta();
            index++;
        }
        calculateResults();
    };

    function nextStepRungeKuta() {
        var kiSet = new KiSet();
        var K1 = new createK1();
        var K2_3_4 = new createK2_3_4();
        var K2 = new createK2();
        var K3 = new createK3();
        var K4 = new createK4();
        K2.__proto__ = K2_3_4;
        K3.__proto__ = K2_3_4;
        K4.__proto__ = K2_3_4;
        kiSet.K1 = K1.getKiSet();
        K2.previousKiSet = kiSet.K1;
        kiSet.K2 = K2.getKiSet();
        K3.previousKiSet = kiSet.K2;
        kiSet.K3 = K3.getKiSet();
        K4.previousKiSet = kiSet.K3;
        kiSet.K4 = K4.getKiSet();

        for(var i=0; i<derivateVars.length; i++) {
            var derivateVariable = derivateVars[i];
            var delta = 1/6*(kiSet.K1[i].value + 2*kiSet.K2[i].value + 2*kiSet.K3[i].value + kiSet.K4[i].value);
            var variable = derivateVariable.relatedDerivate;
            variable.currentValue = variable.currentValue + delta;
            variable.updateValues();
        }
    }

    function createK1() {
        this.getKiSet = function() {
            var k1Set = [];
            for(var i=0; i<derivateVars.length; i++) {
                var derivateVar = derivateVars[i];
                derivateVar.restoreEquation();
                var variables = store.getVariables();
                var k1Val = store.simulationParameters.h * eval(derivateVar.equation);
                k1Set.push(new Ki(k1Val, derivateVar.index));
            }
            return k1Set;
        }
    }

    function createK2_3_4() {
        this.getKiSet = function() {
            var kiSet = [];
            for (var i = 0; i < derivateVars.length; i++) {
                var derivateVar = derivateVars[i];
                derivateVar.restoreEquation();
                checkEquation(derivateVar, this.previousKiSet, this.multiplier);
                var k2Val = store.simulationParameters.h * eval(derivateVar.equation);
                kiSet.push(new Ki(k2Val, derivateVar.index));
            }
            return kiSet;
        }
    }

    function createK2() {
        this.multiplier = 1/2;
    }

    function createK3() {
        this.multiplier = 1/2;
    }

    function createK4() {
        this.multiplier = 1;
    }


    function checkEquation(derivateVar, previousK, multiplier) {
        var varsInEquation = derivateVar.variablesInEquation;
        varsInEquation.forEach(function(varInEquation){
            if(varInEquation.varType === VarType.HAS_DERIVATIVE) {
                changeEquation(derivateVar, varInEquation, previousK, multiplier);
            }
        });

        function changeEquation(derivateVar, varInEquation, previousK, multiplier) {
            var deltaFromK = undefined;
            previousK.forEach(function(k1) {
                if (k1.index === varInEquation.relatedDerivate.index){
                    deltaFromK = multiplier * k1.value;
                }
            });
            var oldExpression = store.getVariableInString(varInEquation.index);
            var newExpression = '(' + oldExpression + '+(' + deltaFromK + '))';
            derivateVar.equation = derivateVar.equation.replaceAll(oldExpression, newExpression);
        }
    }

    function calculateResults() {
        results.getVariables().forEach(function(variable) {
            if(variable.varType !== VarType.HAS_DERIVATIVE) {
                calculateVariable(variable);
            }
        });

        function calculateVariable(variable) {
            isUnknownVariable = true;
            while(isUnknownVariable) {
                isUnknownVariable = false;
                checkVariesVariable(variable);
            }
            for(var i=0; i<results.time.length; i++) {
                replaceCurrentValue(i);
                variable.addValues(eval(variable.equation));
            }

            function replaceCurrentValue(i) {
                variable.variablesInEquation.forEach(function(variableInEquation) {
                    variableInEquation.currentValue = variableInEquation.getValues()[i];
                })
            }
        }
    }

}

function KiSet() {
    this.K1 = [];
    this.K2 = [];
    this.K3 = [];
    this.K4 = [];
}

function Ki(value, index) {
    this.value = value;
    this.index = index;
}

function Results() {
    var variables = [];
    this.time = [0];
    this.getVariableByName = function(name) {
        return searchVariableName(name);
    };
    var searchVariableName = function (name) {
        for (var i = 0; i < variables.length; i++) {
            if (variables[i].name === name)
                return variables[i];
        }
    };
    this.addVariables = function(variablesTable) {
        for(var i=0; i<variablesTable.length; i++) {
            variables.push(variablesTable[i]);
        }
    };
    this.getVariables = function() {
        return variables;
    };
    this.getVariableByIndex = function(index) {
        return searchVariableIndex(index);
    };
    var searchVariableIndex = function (index) {
        for (var i = 0; i < variables.length; i++) {
            if (variables[i].index === index)
                return variables[i];
        }
    };
}

