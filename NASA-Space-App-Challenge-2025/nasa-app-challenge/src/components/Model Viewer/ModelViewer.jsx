import React, { useState } from "react";
import { Suspense } from "react";
import { ModelViewer, ModelInner, Loader } from "react-3d-viewer"; // assuming you use this package

export default function ModelViewers() {
  const [pivot] = useState([0, 0, 0]); // keep pivot center
  const [initYaw] = useState(0);
  const [initPitch] = useState(0);

  const labels = [
    { id: "wheel", title: "Wheel", description: "Supports the car and allows rolling" },
    { id: "body", title: "Body", description: "Main structure of the toy car" },
    { id: "spoiler", title: "Spoiler", description: "Aerodynamic rear spoiler" },
    { id: "headlight", title: "Headlights", description: "Front lights for visibility" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(to bottom, #0b0f18, #000)",
        color: "white",
      }}
    >
      <Suspense fallback={<Loader />}>
        <ModelInner
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
          xOff={0}
          yOff={0}
          pivot={pivot}
          initYaw={initYaw}
          initPitch={initPitch}
          minZoom={0.5}
          maxZoom={10}
          enableMouseParallax
          enableManualRotation
          enableHoverRotation
          enableManualZoom
          autoFrame={false}
          fadeIn
          autoRotate
          autoRotateSpeed={0.25}
          labels={labels}
        />
      </Suspense>
    </div>
  );
}
// import React, { useState } from "react";