// Add your code here
pulseSensor.setPinNumber(AnalogPin.P0)
pulseSensor.viewPulseFor(10)
input.onButtonPressed(Button.A, function () {
    basic.showNumber(pulseSensor.BPMthreshold(512))
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(pulseSensor.BPMleaky(80))
})