/**
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
    * @param value time in seconds, eg: 10 
    */
    //% block="view pulse on LEDs for $value seconds"
    //% value.min=1 value.max=20
    //% weight=80
    export function viewPulseFor(value: number = 10) {
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
    * Computes BPM with readings in 5 seconds
    */
    //% block="beats per minute (BPM)"
    //% weight=50
    export function BPM(): number {
        return BPMthreshold(512)
    }

    /**
    * Computes BPM using a cutoff value, with readings in 5 seconds
    * @param value threshold, eg: 512
    */
    //% block="BPM with threshold $value"
    //% value.min=0 value.max=1023
    //% advanced=true
    export function BPMthreshold(value: number = 512) : number {
        let spikeCount = 0
        let totalInterval = 0
        let previousSample = 1023
        let startTime = input.runningTime()
        let previousSpike = startTime
        let newTime = input.runningTime()
        while (newTime <= startTime + 1000 * 5) {
            let newSample: number = pins.analogReadPin(inputPin)
            if (previousSample < value && newSample >= value) {
                if (spikeCount > 0) {
                    totalInterval = totalInterval + newTime - previousSpike
                }
                spikeCount = spikeCount + 1
                previousSpike = newTime
            }
            led.plotBarGraph(newSample,1023)
            previousSample = newSample
            basic.pause(50)
            newTime = input.runningTime()
        }
        basic.pause(100)
	    return Math.max(0, Math.round(60000 * (spikeCount-1) / totalInterval))
    }

    /**
    * Implements a leaky BPM computation, with readings in 5 seconds
    * @param value decaying factor, eg: 80
    */
    //% block="BPM with decaying factor $value"
    //% value.min=0 value.max=100
    //% advanced=true
    export function BPMleaky(value: number = 80) : number {
        let peakCount = 0
        let totalInterval = 0
        let previousSample = 1023
        let previousSample2 = 1023
        let startTime = input.runningTime()
        let previousPeak = startTime
        let newTime = input.runningTime()
        while (newTime <= startTime + 1000 * 5) {
            let newSample: number = pins.analogReadPin(inputPin)
            newSample = (previousSample * value + newSample * (100-value)) / 100
            if (previousSample > previousSample2 && previousSample > newSample) {
                if (peakCount > 0) {
                    totalInterval = totalInterval + newTime - previousPeak
                }
                peakCount = peakCount + 1
                previousPeak = newTime
            }
	        led.plotBarGraph(newSample,1023)
            previousSample2 = previousSample
            previousSample = newSample
            basic.pause(50)
            newTime = input.runningTime()
        }
        basic.pause(100)
	    return Math.max(0, Math.round(60000 * (peakCount-1) / totalInterval))
    }


}
