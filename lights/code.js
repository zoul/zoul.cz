var vis = (function() {

    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };

    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }

    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

function Clicker(interval, volume) {

    var timerID = -1;
    var sample = new Audio('click.wav');

    sample.volume = volume || 1;

    this.play = function() {
        if (timerID == -1) {
            timerID = window.setInterval(function() {
                sample.play();
            }, interval || 500);
        }
    };

    this.stop = function() {
        if (timerID != -1) {
            window.clearInterval(timerID);
            timerID = -1;
        }
    };
}

function Timer(id, interval, volume) {

    var slowClicker = new Clicker(interval, volume);
    var fastClicker = new Clicker(interval/3, volume);
    var toggleInterval = Math.floor(Math.random() * 20 + 20);
    var displayElement = document.getElementById('light' + id);
    var timerID = -1;

    var log = function(msg) {
        console.log('Timer #' + id + ' (@' + interval + ', toggle ' + toggleInterval + 's): ' + msg);
    };

    var slowPhase = function() {
        log('starting slow phase.');
        slowClicker.play();
        displayElement.className = '';
        timerID = window.setTimeout(function() {
            slowClicker.stop();
            fastPhase();
        }, toggleInterval*1000);
    };

    var fastPhase = function() {
        log('starting fast phase.');
        fastClicker.play();
        displayElement.className = 'walk';
        timerID = window.setTimeout(function() {
            fastClicker.stop();
            slowPhase();
        }, toggleInterval*1000);
    };

    this.play = function() {
        var startDelay = Math.random() * 1000;
        window.setTimeout(function() {
            slowPhase();
        }, startDelay);
    };

    this.stop = function() {
        window.clearTimeout(timerID);
        slowClicker.stop();
        fastClicker.stop();
        log('stopped.');
    };
}

window.onload = function() {
    var timer1 = new Timer(1, 800, 1.0);
    var timer2 = new Timer(2, 790, 0.3);
    timer1.play();
    timer2.play();
    vis(function() {
        if (vis()) {
            timer1.play();
            timer2.play();
        } else {
            timer1.stop();
            timer2.stop();
        }
    });
};
