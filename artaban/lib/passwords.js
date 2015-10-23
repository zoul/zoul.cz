function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function submitPassword() {

    var nextRetryTimeCookie = 'nextRetryTime';
    var retryTime = 5 * 60 * 1000;

    var currentUNIXTime = (new Date()).getTime();
    var checkpointCode = document.getElementById("checkpoint").value.toLowerCase();
    var password = document.getElementById("password").value.toLowerCase();
    var token = checkpointCode + "#" + password;
    var solutionURL = "solutions/" + md5(token) + ".html?" + currentUNIXTime;
    var container = $('.output');

    var minRetryTime = readCookie(nextRetryTimeCookie);
    if (minRetryTime != null && currentUNIXTime < minRetryTime) {
        container.html('Na další pokus je příliš brzy, ještě si počkejte.');
        return;
    }

    createCookie(nextRetryTimeCookie, currentUNIXTime + retryTime);
    container.html('Zkouším…');

    jQuery.ajax({
        url: solutionURL,
        success: function(data) {
            container.html(data);
            eraseCookie(nextRetryTimeCookie);
        },
        error: function() {
            container.html('Máte špatně kód stanoviště, heslo, nebo obojí.');
        },
    });
    return false;
}

$(document).ready(function() {
    $('#checkpoint').focus();
})
