package com.boazblake.motion

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.content.Context
import com.getcapacitor.*
import kotlin.math.max

@CapacitorPlugin(name = "Motion")
class MotionPlugin : Plugin(), SensorEventListener {

    private var sensorManager: SensorManager? = null
    private var rotVec: Sensor? = null
    private var grav: Sensor? = null
    private var gyro: Sensor? = null
    private var hz: Double = 60.0
    private var yawZero: Float = 0f

    private val gravity = FloatArray(3) { 0f }
    private val quat = FloatArray(4) { 0f }
    private val rotRate = FloatArray(3) { 0f }

    override fun load() {
        sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        rotVec = sensorManager?.getDefaultSensor(Sensor.TYPE_GAME_ROTATION_VECTOR)
        grav = sensorManager?.getDefaultSensor(Sensor.TYPE_GRAVITY)
        gyro = sensorManager?.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
    }

    @PluginMethod
    fun start(call: PluginCall) {
        hz = call.getDouble("hz", 60.0)
        val us = (1_000_000.0 / max(1.0, hz)).toInt()

        // CRITICAL CHECK: Ensure both rotation and gyroscope are available
        if (rotVec == null) {
            call.reject("Rotation vector sensor unavailable")
            return
        } else if (gyro == null) {
            call.reject("Gyroscope sensor unavailable for rotationRate")
            return
        }
        
        // Register listeners
        sensorManager?.registerListener(this, rotVec, us)
        sensorManager?.registerListener(this, grav, us)
        sensorManager?.registerListener(this, gyro, us)
        call.resolve()
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        sensorManager?.unregisterListener(this)
        call.resolve()
    }

    @PluginMethod
    fun calibrateYaw(call: PluginCall) {
        // Placeholder implementation
        yawZero = 0f
        call.resolve()
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_GAME_ROTATION_VECTOR -> {
                val tmp = FloatArray(4)
                SensorManager.getQuaternionFromVector(tmp, event.values)
                // tmp = [w, x, y, z] — reorder to [x, y, z, w]
                quat[0] = tmp[1]
                quat[1] = tmp[2]
                quat[2] = tmp[3]
                quat[3] = tmp[0]
            }
            Sensor.TYPE_GRAVITY -> {
                gravity[0] = event.values[0]
                gravity[1] = event.values[1]
                gravity[2] = event.values[2]
            }
            Sensor.TYPE_GYROSCOPE -> {
                rotRate[0] = event.values[0]
                rotRate[1] = event.values[1]
                rotRate[2] = event.values[2]
            }
        }

        // Emit whenever we have a fresh rotation event, bundling the last known gravity/gyro values
        if (event.sensor.type == Sensor.TYPE_GAME_ROTATION_VECTOR) {
            val data = JSObject()
            val q = JSArray().put(quat[0]).put(quat[1]).put(quat[2]).put(quat[3])
            val g = JSArray().put(gravity[0]).put(gravity[1]).put(gravity[2])
            val r = JSArray().put(rotRate[0]).put(rotRate[1]).put(rotRate[2])

            data.put("quaternion", q)
            data.put("gravity", g)
            data.put("rotationRate", r)
            data.put("timestamp", System.currentTimeMillis().toDouble())

            notifyListeners("motion", data, true)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) { /* no-op */ }
}
