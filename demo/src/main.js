import { Motion } from "capacitor-native-motion";

const dot = document.getElementById("dot");
const info = document.getElementById("info");

// normalize 3-vector
const norm = (v) => {
  const m = Math.hypot(v[0], v[1], v[2]);
  return m ? [v[0] / m, v[1] / m, v[2] / m] : [0, 0, 0];
};

// forward vector from quaternion [x,y,z,w]
const forwardFromQuat = ([x, y, z, w]) => [
  2 * (x * z + w * y),
  2 * (y * z - w * x),
  1 - 2 * (x * x + y * y),
];

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

async function init() {
  await Motion.start({ hz: 60 });

  await Motion.addListener("motion", ({ gravity }) => {
    const g = gravity; // [gx, gy, gz]
    // convert gravity [-1,1] to screen space [0,1]
    const x = clamp((g[0] + 1) / 2, 0, 1);
    const y = clamp(1 - (g[1] + 1) / 2, 0, 1); // flip Y so “up” tilts up

    dot.style.left = `${x * window.innerWidth}px`;
    dot.style.top = `${y * window.innerHeight}px`;
  });
}

init();
// async function init() {
//   await Motion.start({ hz: 60 });
//
//   await Motion.addListener("motion", ({ quaternion, gravity }) => {
//     const q = quaternion;
//     const g = norm(gravity);
//     const f = norm(forwardFromQuat(q));
//
//     // project "forward" vector onto screen plane using gravity as "up"
//     const up = [-g[0], -g[1], -g[2]];
//     const right = norm([
//       up[1] * f[2] - up[2] * f[1],
//       up[2] * f[0] - up[0] * f[2],
//       up[0] * f[1] - up[1] * f[0],
//     ]);
//     const dotUp = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
//     const forwardProj = norm([
//       f[0] - dotUp(f, up) * up[0],
//       f[1] - dotUp(f, up) * up[1],
//       f[2] - dotUp(f, up) * up[2],
//     ]);
//
//     const x = dotUp(right, forwardProj);
//     const y = dotUp(up, forwardProj);
//
//     const nx = (x + 1) / 2;
//     const ny = (1 - y) / 2;
//
//     dot.style.left = `${nx * window.innerWidth}px`;
//     dot.style.top = `${ny * window.innerHeight}px`;
//
//     info.textContent =
//       `Quaternion: [${q.map((v) => v.toFixed(2)).join(", ")}]\n` +
//       `Gravity: [${g.map((v) => v.toFixed(2)).join(", ")}]`;
//   });
// }
//
// init().catch((err) => {
//   info.textContent = "Motion plugin failed: " + err;
// });
