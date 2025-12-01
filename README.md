# capacitor-native-motion

High-performance native device motion plugin for Capacitor.

Streams **quaternion + gravity + rotation rate** at up to **100 Hz** on both iOS and Android. Perfect for AR, gesture controls, robotics, motion capture, and any app that requires buttery-smooth orientation data.

## Installation

```bash
npm install capacitor-native-motion
npx cap sync
```

## Usage

```typescript
import { Motion } from "capacitor-native-motion";

const initMotion = async () => {
  // Start streaming at 60 Hz (Default is 60, Max is 100)
  // NOTE: This returns a function you can call to stop the sensor engine.
  const stop = await Motion.start({ frequency: 60 });

  // Listen to every sensor frame
  const listener = await Motion.addListener("motion", (event) => {
    console.log("Quaternion   →", event.quaternion); // { x, y, z, w }
    console.log("Gravity      →", event.gravity); // { x, y, z }
    console.log("Rotation Rate→", event.rotationRate); // { alpha, beta, gamma }
    console.log("Timestamp    →", event.timestamp);
  });

  // To stop listening:
  // listener.remove();
  // To stop the sensor engine:
  // await stop();
};
```

## API

### `start(options?)`

Starts the motion sensor engine.

**Parameters:**

| Name          | Type                                                         | Description                                                                                               |
| :------------ | :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **`options`** | `{ frequency?: number, iosReferenceFrame?: ReferenceFrame }` | The update frequency in Hz (10–100). Default: `60`. iOS optional: specify the CoreMotion reference frame. |

**Returns:** `Promise<() => Promise<void>>`
Returns a function that, when called, stops the sensor engine.

---

### Event: `'motion'`

The payload received by the `addListener` handler.

```typescript
interface MotionSample {
  /**
   * Device orientation as a unit quaternion. [x, y, z, w]
   */
  quaternion: Quaternion;

  /**
   * The gravity vector expressed in the device's reference frame. [x, y, z]
   */
  gravity: Vec3;

  /**
   * The rate of rotation (angular velocity) around each axis (rad/s). [alpha, beta, gamma]
   */
  rotationRate: Vec3;

  /**
   * The timestamp of the reading in milliseconds (ms epoch).
   */
  timestamp: number;
}
```

## Supported Platforms

- **iOS:** 13+
- **Android:** 5.0+

## License

MIT © Boaz Blake
