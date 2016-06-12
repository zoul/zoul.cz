var lastTime = 0

// https://gist.github.com/manast/1185904
function Timer(duration, fn) {

    this.baseline = undefined

    this.run = function() {
        if (this.baseline === undefined) {
            this.baseline = new Date().getTime()
        }
        fn()
        var end = new Date().getTime()
        this.baseline += duration

        var nextTick = duration - (end - this.baseline)
        if (nextTick < 0) {
            nextTick = 0
        }
        (function(i){
            i.timer = setTimeout(function(){
                i.run(end)
            }, nextTick)
        }(this))
    }

    this.stop = function() {
        clearTimeout(this.timer)
    }
}

function resetClock() {
    lastTime = Date.now()
}

function updateClock() {
    var diff = Date.now() - lastTime
    var clockDiv = document.getElementById('clock')
    clockDiv.innerHTML = (diff/1000).toFixed(2) + " s"
}

function updateCounter() {

    var counterDiv = document.getElementById('counter')
    var previousValue = counterDiv.innerHTML
    var glyphs = ['☂', '♠︎', '♣︎', '♥︎', '♦︎']

    do {
        var index = Math.floor(Math.random()*10 % glyphs.length)
        var newValue = glyphs[index]
    } while (newValue == previousValue)

    counterDiv.innerHTML = newValue

    if (newValue == glyphs[0]) {
        counterDiv.className = 'now'
    } else {
        counterDiv.className = ''
    }

    resetClock()
}

var counterTimer = new Timer(2000, updateCounter)
var clockTimer = new Timer(50, updateClock)

window.onload = function() {
    resetClock()
    counterTimer.run()
    clockTimer.run()
}
