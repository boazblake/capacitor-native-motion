import Capacitor
import CoreMotion

@objc(MotionPlugin)
public class MotionPlugin: CAPPlugin {
    private let motion = CMMotionManager()
    private let queue = OperationQueue()
    private var isRunning = false

    @objc func start(_ call: CAPPluginCall) {
        if isRunning { call.resolve(); return }

        let hz = call.getDouble("hz") ?? 60.0
        motion.deviceMotionUpdateInterval = 1.0 / hz
        queue.name = "MotionPluginQueue"
        queue.qualityOfService = .userInteractive

        guard motion.isDeviceMotionAvailable else {
            call.reject("Device motion not available")
            return
        }

        let frame = CMAttitudeReferenceFrame.xArbitraryCorrectedZVertical
        // [weak self] captures self weakly to prevent a retain cycle
        motion.startDeviceMotionUpdates(using: frame, to: queue) { [weak self] dm, err in
            guard err == nil, let dm = dm else { return }
            
            let q = dm.attitude.quaternion
            let g = dm.gravity
            let r = dm.rotationRate // Includes pitch, roll, and yaw rate (rad/s)
            
            let payload: [String: Any] = [
                "quaternion": [q.x, q.y, q.z, q.w],
                "gravity": [g.x, g.y, g.z],
                "rotationRate": [r.x, r.y, r.z],
                "timestamp": Date().timeIntervalSince1970 * 1000.0
            ]
            
            // Dispatch to the main thread to notify listeners (required by Capacitor)
            DispatchQueue.main.async {
                self?.notifyListeners("motion", data: payload)
            }
        }

        isRunning = true
        call.resolve()
    }

    @objc func stop(_ call: CAPPluginCall) {
        if isRunning {
            motion.stopDeviceMotionUpdates()
            isRunning = false
        }
        call.resolve()
    }
}
