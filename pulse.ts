/**
sampleLengthMS
 * This code is created for the Pulse Sensor Amped open platform and based on the code they kindly made available
 */

/**
 * Custom blocks
 */

//% color=#00004c icon="\uf21e" block="Pulse"

namespace pulseSensor {

    let inputPin: AnalogPin = AnalogPin.P0

    //% block="set input pin to $pin"
    //% weight=100
    export function setPinNumber(pin: AnalogPin = AnalogPin.P0) {
        inputPin = pin
    }
	
    /**
    * view pulse on LEDs as it happens
    * @param value eg: 5 
    */
    //% block="view pulse on LEDs for $value seconds"
    //% value.min=1 value.max=15
    //% weight=80
    export function viewPulseFor(value: number = 5) {
        let time = input.runningTime()
        while (input.runningTime() <= time + 1000 * value) {
            led.plotBarGraph(
                pins.analogReadPin(inputPin),
                1023
            )
            basic.pause(100)
        }
        basic.showLeds(`
        . . # . .
        . # # . .
        # # # . #
        . . # # .
        . . # . .
        `)
    }

    /**
    * gets Beats Per Minute, with readings in 5 seconds
    * @param value eg: 512
    */
    //% block="BPM with threshold $value"
    //% value.min=0 value.max=1023
    //% weight=50
    export function BPMthreshold(value: number = 512) : number {
        let spikeCount = 0
        let totalInterval = 0
        let previousSample = 1023
        let startTime = input.runningTime()
        let previousSpike = startTime
        let newTime = input.runningTime()
        while (newTime <= startTime + 5000) {
            let newSample: number = pins.analogReadPin(inputPin)
            if (previousSample < value && newSample >= value) {
                if (spikeCount > 0) {
                    totalInterval = totalInterval + newTime - previousSpike
                }
                spikeCount = spikeCount + 1
                previousSpike = newTime
            }
            previousSample = newSample
            basic.pause(50)
            newTime = input.runningTime()
        }
        return Math.round(60 * (spikeCount-1) / totalInterval)
    }

    /**
    * implements a leaky BPM computation, with readings in 5 seconds
    * @param value eg: 80
    */
    //% block="BPM with decaying factor $value"
    //% value.min=0 value.max=100
    //% weight=40
    export function BPMleaky(value: number = 80) : number {
        let peakCount = 0
        let totalInterval = 0
        let previousSample = 1023
        let previousSample2 = 1023
        let startTime = input.runningTime()
        let previousPeak = startTime
        let newTime = input.runningTime()
        while (newTime <= startTime + 5000) {
            let newSample: number = pins.analogReadPin(inputPin)
            newSample = (previousSample * value + newSample * (100-value)) / 100
            if (previousSample > previousSample2 && previousSample > newSample) {
                if (peakCount > 0) {
                    totalInterval = totalInterval + newTime - previousPeak
                }
                peakCount = peakCount + 1
                previousPeak = newTime
            }
            previousSample2 = previousSample
            previousSample = newSample
            basic.pause(50)
            newTime = input.runningTime()
        }
        return Math.round(60 * (peakCount-1) / totalInterval)
    }


}
