var plumb;
$(document).ready(function() {
    plumb = new Plumb();
});

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

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function partial(func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments).splice(1);
    return function() {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
}




