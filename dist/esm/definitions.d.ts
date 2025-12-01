export type Quaternion = [number, number, number, number];
export type Vec3 = [number, number, number];
export type ReferenceFrame = "xArbitraryZVertical" | "xArbitraryCorrectedZVertical" | "xMagneticNorthZVertical" | "xTrueNorthZVertical";
export interface StartOptions {
    hz?: number;
    iosReferenceFrame?: ReferenceFrame;
}
export interface MotionSample {
    quaternion: Quaternion;
    gravity: Vec3;
    rotationRate: Vec3;
    timestamp: number;
}
export interface MotionPlugin {
    start(options?: StartOptions): Promise<void>;
    stop(): Promise<void>;
    calibrateYaw(): Promise<void>;
    addListener(eventName: "motion", listener: (sample: MotionSample) => void): Promise<{
        remove: () => void;
    }>;
    removeAllListeners(): Promise<void>;
}
