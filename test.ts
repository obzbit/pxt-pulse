pulseSensor.setPinNumber(AnalogPin.P0)

pulseSensor.viewPulseFor(10)

basic.forever(function () {
    basic.showNumber(pulseSensor.BPM())
})