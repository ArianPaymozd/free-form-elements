import { useEffect, useState } from "react";
import Field from "./Field";
import "./styles.css";

export default function App() {
  useEffect(() => {
    function preventBehavior(e) {
      e.preventDefault();
    }

    window.addEventListener("touchmove", preventBehavior, { passive: false });
  }, []);
  const [mouseX, setMouseX] = useState();
  const [mouseY, setMouseY] = useState();
  const [used, setUsed] = useState(new Set());
  const [form, setForm] = useState({
    20102123: {
      content: "header",
      height: 100,
      width: 70,
      x: 0,
      y: 0
    },
    41234514: {
      content: "field 1",
      height: 100,
      width: 70,
      x: 0,
      y: 110
    },
    10342343: {
      content: "field 2",
      height: 100,
      width: 70,
      x: 0,
      y: 220
    },
    18123123: {
      content: "field 5",
      height: 100,
      width: 70,
      x: 0,
      y: 330
    }
  });
  const handleMove = (e) => {
    e.preventDefault();
    setMouseY(e.clientY);
    setMouseX(e.clientX);
  };
  const handleTouch = (e) => {
    e.preventDefault();
    setMouseY(e.touches[0].clientY);
    setMouseX(e.touches[0].clientX);
  };
  return (
    <div
      onMouseMove={(e) => handleMove(e)}
      onTouchMove={(e) => handleTouch(e)}
      style={{ position: "relative" }}
      className="App"
    >
      {Object.keys(form).map((fieldID, idx) => {
        const field = form[fieldID];
        return (
          <Field
            used={used}
            setUsed={setUsed}
            fieldID={fieldID}
            setForm={setForm}
            mouseX={mouseX}
            mouseY={mouseY}
            heightProp={field.height}
            widthProp={field.width}
            xProp={field.x}
            yProp={field.y}
          />
        );
      })}
    </div>
  );
}
