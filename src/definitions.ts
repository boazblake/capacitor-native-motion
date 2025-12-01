export type Quaternion = [number, number, number, number]; // [x, y, z, w]
export type Vec3 = [number, number, number]; // [x, y, z] or [alpha, beta, gamma]

export type ReferenceFrame =
  | "xArbitraryZVertical"
  | "xArbitraryCorrectedZVertical"
  | "xMagneticNorthZVertical"
  | "xTrueNorthZVertical";

export interface StartOptions {
  hz?: number; // e.g. 60
  iosReferenceFrame?: ReferenceFrame;
}

export interface MotionSample {
  quaternion: Quaternion;
  gravity: Vec3;
  rotationRate: Vec3; // [alpha, beta, gamma] in rad/s (x, y, z in native code)
  timestamp: number; // ms epoch
}

export interface MotionPlugin {
  start(options?: StartOptions): Promise<void>;
  stop(): Promise<void>;
  calibrateYaw(): Promise<void>;
  addListener(
    eventName: "motion",
    listener: (sample: MotionSample) => void,
  ): Promise<{ remove: () => void }>;
  removeAllListeners(): Promise<void>;
}
