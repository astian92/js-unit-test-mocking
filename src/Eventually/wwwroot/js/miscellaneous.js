
//IMPORTANT - ajax calls simplified
var Ajax = (function () {
    var ajaxCall = function (type, url, data, settings) {

        var ajaxObject = {
            type: type,
            url: url,
            data: data || undefined
        };

        for (var propertyName in settings) {
            ajaxObject[propertyName] = settings[propertyName];
        }

        return $.ajax(ajaxObject);
    }

    var ajaxHandledCall = function (type, url, data, settings) {
        var promise = ajaxCall(type, url, data, settings);

        promise.done(function (ticket) {
            if (ticket.Event != undefined && ticket.Event != null && ticket.Event != "") {
                InfoNav.renderResponse(ticket);
            }
        }).fail(function (error) {
            InfoNav.addError({ Message: "There was an unexpected error! Please check if your network connection is ok." });
        });

        return promise;
    }

    var get = function (url, settings) {
        return ajaxCall('GET', url, undefined, settings);
    }

    var post = function (url, data, settings) {
        return ajaxCall('POST', url, data, settings);
    }

    var getAndHandle = function (url, settings) {
        return ajaxHandledCall('GET', url, undefined, settings);
    }

    var postAndHandle = function (url, data, settings) {
        return ajaxHandledCall('POST', url, data, settings);
    }

    return {
        get: get,
        post: post,
        getAndHandle: getAndHandle,
        postAndHandle: postAndHandle
    }
}());

function RoundNumber(number, digits) {
    if (typeof number != "number") {
        throw "Number argument has to be a number!";
    }

    if (typeof digits != "number") {
        throw "Digits argument has to be an number!"
    }

    if (digits < 0) {
        throw "Digits cannot be a negative number!";
    }

    var gear = Math.pow(10, digits);

    var up = number * gear;
    var ceiled = Math.ceil(up);
    var down = ceiled / gear;

    return down;
    
    //return Math.ceil(number * gear) / gear;
}

var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    }
    return function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };
})();

Number.prototype.pad = function (size) {
    if (!size && size != 0) {
        throw "Size of padd must be a number!";
    }

    if (size < 0) {
        throw "size of padd must be a positive number!";
    }

    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}

//--1
//returns FULL specification of every css property applied for the given object (only from stylesheets!)
function css(jqueryElement) {
    if (!jqueryElement || jqueryElement.length == 0) {
        throw "Element is missing!";
    }

    var sheets = document.styleSheets;
    var result = {};

    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;

        for (var rule in rules) {
            if (jqueryElement.is(rules[rule].selectorText)) { //matches to css selector (true)
                //result = $.extend(result, css2json(rules[rule].style), css2json(jqueryElement.attr('style')));
                result = $.extend(result, rules[rule].style, jqueryElement.attr('style'));
            }
        }
    }

    return result;
}

//gets the position of the cursor(caret) in an input field. ctrl must be a simple element (not jquery element)
function getCaretPosition(ctrl) {
    var CaretPos = 0;
    // IE Support
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        CaretPos = ctrl.selectionStart;
    }

    return (CaretPos);
}

function setCaretPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

//Changes minutes (as integer) to hh:mm format
function toHHMM(intMinutes) {
    var sign = "";
    if (intMinutes < 0) {
        sign = '-';
        intMinutes *= -1;
    }
    var minutes = intMinutes % 60;
    var hours = (intMinutes - minutes) / 60;
    //var minutes = (((decimalHour * 100) % 100) / 100) * 60;
    if (hours.length == 1) {
        hours = '0' + hours;
    }
    if (minutes == '0') {
        minutes = '00';
    }
    if (minutes < 0) {
        minutes = minutes + 60;
        hours++;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    return sign + hours + ":" + minutes;
}

//Changes from hh:mm to minutes (as int)
function toIntMinutes(hhMM) {
    var isMinus = 1;
    if (hhMM[0] == "-") {
        isMinus = -1;
    }

    if (hhMM.indexOf(':') == -1) {
        return 0;
    }
    var items = hhMM.split(":");
    var hours = parseInt(items[0]) * 60;
    var minutes = items[1];

    return isMinus * (Math.abs(parseInt(hours)) + parseInt(minutes));
}