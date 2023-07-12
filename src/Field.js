import { useEffect, useRef, useState } from "react";
import { useSpring, a } from "react-spring";
import BoundingBox from "./BoundingBox";

const Field = ({
  heightProp,
  widthProp,
  xProp,
  yProp,
  mouseX,
  mouseY,
  fieldID,
  setForm,
  used,
  setUsed
}) => {
  const [using, setUsing] = useState([]);
  const [invalid, setInvalid] = useState(false);
  const [height, setHeight] = useState(heightProp);
  const [width, setWidth] = useState(widthProp);
  const [x, setX] = useState(xProp);
  const [y, setY] = useState(yProp);
  const [previewX, setPreviewX] = useState(xProp);
  const [previewY, setPreviewY] = useState(yProp);
  const [previewHeight, setPreviewHeight] = useState(height);
  const [previewWidth, setPreviewWidth] = useState(width);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [widthScale, setWidthScale] = useState(window.innerWidth / 2550);
  const [heightScale, setHeightScale] = useState(window.innerHeight / 3300);
  const [cellWidth, setCellWidth] = useState(212.5 * widthScale);
  const [cellHeight, setCellHeight] = useState(137.5 * heightScale);

  const style = useSpring({
    height: height,
    width: width,
    top: dragging ? mouseY - height / 2 : y,
    left: dragging ? mouseX - width / 2 : x,
    background: "black",
    position: "absolute",
    zIndex: 3
  });

  const resizeStyle = useSpring({
    height: previewHeight,
    width: previewWidth,
    top: dragging ? mouseY - height / 2 : y,
    left: dragging ? mouseX - width / 2 : x,
    position: "absolute",
    zIndex: 2
  });

  const resizeBoxStyle = useSpring({
    height: "100vw",
    width: "100vw",
    top: 0,
    left: 0,
    // paddingTop: cellHeight / 2,
    // paddingBottom: cellHeight / 2,
    // paddingLeft: cellWidth / 2,
    // paddingRight: cellWidth / 2,
    position: "absolute",
    zIndex: 2
  });

  // const handleMouseUp = (e) => {
  //   e.preventDefault();
  //   setDragging(false);
  //   const newUsed = used;
  //   if (invalid) {
  //     for (const item of using) {
  //       newUsed.add(item);
  //     }
  //     return;
  //   }
  //   const cellWidth = 212.5 * widthScale;
  //   const cellHeight = 137.5 * heightScale;
  //   const x = mouseX - width / 2; //x position within the element.
  //   const y = mouseY - height / 2;
  //   const snapX = Math.round(x / cellWidth) * cellWidth;
  //   const snapY = Math.round(y / cellHeight) * cellHeight;

  //   setX(Math.floor(snapX));
  //   setY(Math.floor(snapY));
  //   setForm((prev) => ({
  //     ...prev,
  //     [fieldID]: {
  //       ...prev[fieldID],
  //       x: Math.floor(snapX),
  //       y: Math.floor(snapY)
  //     }
  //   }));
  //   const cellsY = Math.ceil(height / cellHeight);
  //   const cellsX = Math.ceil(width / cellWidth);
  //   const newUsing = [`(${Math.floor(snapX)}, ${Math.floor(snapY)})`];
  //   newUsed.add(`(${Math.floor(snapX)}, ${Math.floor(snapY)})`);
  //   for (let i = 1; i < cellsY; i++) {
  //     newUsing.push(
  //       `(${Math.floor(snapX)}, ${Math.floor(snapY + cellHeight * i)})`
  //     );
  //     newUsed.add(
  //       `(${Math.floor(snapX)}, ${Math.floor(snapY + cellHeight * i)})`
  //     );
  //   }
  //   for (let i = 1; i < cellsX; i++) {
  //     newUsing.push(
  //       `(${Math.floor(snapX + cellWidth * i)}, ${Math.floor(snapY)})`
  //     );
  //     newUsed.add(
  //       `(${Math.floor(snapX + cellWidth * i)}, ${Math.floor(snapY)})`
  //     );
  //   }
  //   setUsed(newUsed);
  //   setUsing(newUsing);
  // };

  const handleMouseMove = (e) => {
    e.preventDefault();
    const cellsY = Math.ceil(height / cellHeight);
    const cellsX = Math.ceil(width / cellWidth);
    if (dragging) {
      const x = mouseX - width / 2;
      const y = mouseY - height / 2;
      const snapX = Math.round(x / cellWidth) * cellWidth;
      const snapY = Math.round(y / cellHeight) * cellHeight;
      setPreviewX(Math.floor(snapX));
      setPreviewY(Math.floor(snapY));
      let isInvalid = false;
      if (used.has(`(${Math.floor(snapX)}, ${Math.floor(snapY)})`))
        isInvalid = true;
      for (let i = 0; i < cellsY; i++) {
        if (
          used.has(
            `(${Math.floor(snapX)}, ${Math.floor(snapY + cellHeight * i)})`
          )
        )
          isInvalid = true;
      }
      for (let i = 0; i < cellsX; i++) {
        if (
          used.has(
            `(${Math.floor(snapX + cellWidth * i)}, ${Math.floor(snapY)})`
          )
        )
          isInvalid = true;
      }
      setInvalid(isInvalid);
    }
  };
  const handleResize = (e) => {
    const resizingCoords = {
      x: [x, x + width],
      y: [y, y + height]
    };
    if (
      resizing &
      (mouseX <= resizingCoords.x[0] + cellWidth / 2 ||
        mouseX >= resizingCoords.x[0] - cellWidth / 2 ||
        mouseX <= resizingCoords.x[1] + cellWidth / 2 ||
        mouseX >= resizingCoords.x[1] - cellWidth / 2)
    ) {
      const cellsY = Math.ceil(previewHeight / cellHeight);
      const cellsX = Math.ceil(previewWidth / cellWidth);
      console.log("resizing");
      let newWidth = mouseX - x;
      setPreviewWidth(newWidth - 10);
      newWidth = Math.round(newWidth / cellWidth) * cellWidth;
      setWidth(newWidth);
      let isInvalid = false;
      if (used.has(`(${Math.floor(x)}, ${Math.floor(y)})`)) isInvalid = true;
      for (let i = 0; i < cellsY; i++) {
        if (used.has(`(${Math.floor(x)}, ${Math.floor(y + cellHeight * i)})`))
          isInvalid = true;
      }
      for (let i = 0; i < cellsX; i++) {
        if (used.has(`(${Math.floor(x + cellWidth * i)}, ${Math.floor(y)})`))
          isInvalid = true;
      }
      setInvalid(isInvalid);
    } else if (
      resizing &
      (e.clientY <= resizingCoords.y[0] + 10 ||
        e.clientY <= resizingCoords.y[0] - 10 ||
        e.clientY <= resizingCoords.y[1] + 10 ||
        e.clientY <= resizingCoords.y[1] - 10)
    ) {
    }
  };

  const handleClick = () => {
    if (dragging & !resizing) {
      setDragging(false);
      const newUsed = used;
      if (invalid) {
        for (const item of using) {
          newUsed.add(item);
        }
        return;
      }
      const cellWidth = 212.5 * widthScale;
      const cellHeight = 137.5 * heightScale;
      const x = mouseX - width / 2; //x position within the element.
      const y = mouseY - height / 2;
      const snapX = Math.round(x / cellWidth) * cellWidth;
      const snapY = Math.round(y / cellHeight) * cellHeight;

      setX(Math.floor(snapX));
      setY(Math.floor(snapY));
      setForm((prev) => ({
        ...prev,
        [fieldID]: {
          ...prev[fieldID],
          x: Math.floor(snapX),
          y: Math.floor(snapY)
        }
      }));
      const cellsY = Math.ceil(height / cellHeight);
      const cellsX = Math.ceil(width / cellWidth);
      const newUsing = [];
      for (const item of using) {
        newUsed.delete(item);
      }
      for (let i = 0; i < cellsY; i++) {
        for (let j = 0; j < cellsX; j++) {
          newUsing.push(
            `(${Math.floor(x + cellWidth * j)}, ${Math.floor(
              y + cellHeight * i
            )})`
          );
          newUsed.add(
            `(${Math.floor(x + cellWidth * j)}, ${Math.floor(
              y + cellHeight * i
            )})`
          );
        }
      }
      setUsed(newUsed);
      setUsing(newUsing);
      setDragging(false);
      setResizing(true);
    } else if (!dragging & !resizing) {
      const newUsed = used;
      for (const item of using) {
        newUsed.delete(item);
      }
      setUsed(newUsed);
      setDragging(true);
    } else if (resizing) {
      console.log("ASDASDASD");
      setResizing(false);
      const newUsed = used;
      const cellsY = Math.ceil(height / cellHeight);
      const cellsX = Math.ceil(width / cellWidth);
      console.log(cellsX, width, widthScale);
      const newUsing = [];
      for (const item of using) {
        newUsed.delete(item);
      }
      for (let i = 0; i < cellsY; i++) {
        for (let j = 0; j < cellsX; j++) {
          newUsing.push(
            `(${Math.floor(x + cellWidth * j)}, ${Math.floor(
              y + cellHeight * i
            )})`
          );
          newUsed.add(
            `(${Math.floor(x + cellWidth * j)}, ${Math.floor(
              y + cellHeight * i
            )})`
          );
        }
      }
      console.log(newUsed, newUsing);
      setUsed(newUsed);
      setUsing(newUsing);
    }
  };

  const handleMouseDown = (e) => {
    const resizingCoords = {
      x: [x, x + width],
      y: [y, y + height]
    };
    console.log(resizingCoords, e.clientX, e.clientY);
    if (
      resizing &
      (e.clientX <= resizingCoords.x[0] + 10 ||
        e.clientX <= resizingCoords.x[0] - 10 ||
        e.clientX <= resizingCoords.x[1] + 10 ||
        e.clientX <= resizingCoords.x[1] - 10)
    ) {
      console.log("resizing");
      const newWidth = e.clientX - x;
      setWidth(newWidth);
    } else if (
      resizing &
      (e.clientY <= resizingCoords.y[0] + 10 ||
        e.clientY <= resizingCoords.y[0] - 10 ||
        e.clientY <= resizingCoords.y[1] + 10 ||
        e.clientY <= resizingCoords.y[1] - 10)
    ) {
    }
  };

  return (
    <>
      {resizing ? (
        <a.div
          onMouseMove={(e) => handleResize(e)}
          style={{
            ...resizeBoxStyle,
            background: "none",
            margin: 0
          }}
        >
          <a.div
            onClick={() => handleClick()}
            onMouseMove={(e) => handleMouseMove(e)}
            // onMouseDown={(e) => handleMouseDown(e)}
            // onMouseUp={(e) => handleMouseUp(e)}
            // onTouchStart={(e) => handleMouseDown(e)}
            // onTouchEnd={(e) => handleMouseUp(e)}
            onTouchMove={(e) => handleMouseMove(e)}
            style={{ ...style }}
          ></a.div>
        </a.div>
      ) : (
        <a.div
          onClick={() => handleClick()}
          onMouseMove={(e) => handleMouseMove(e)}
          // onMouseDown={(e) => handleMouseDown(e)}
          // onMouseUp={(e) => handleMouseUp(e)}
          // onTouchStart={(e) => handleMouseDown(e)}
          // onTouchEnd={(e) => handleMouseUp(e)}
          onTouchMove={(e) => handleMouseMove(e)}
          style={{ ...style, border: "none" }}
        ></a.div>
      )}
      {dragging ? (
        <a.div
          style={{
            ...style,
            // height: previewHeight,
            // width: previewWidth,
            top: previewY,
            left: previewX,
            background: "gray",
            zIndex: 1,
            borderStyle: "dotted",
            borderColor: invalid ? "red" : "blue"
          }}
        ></a.div>
      ) : null}
      {resizing ? (
        <a.div
          style={{
            ...resizeStyle
            // borderStyle: "dotted",
            // borderColor: invalid ? "red" : "blue"
          }}
          onMouseMove={(e) => handleResize(e)}
          onClick={() => handleClick()}
        >
          <BoundingBox
            height={previewHeight}
            width={previewWidth}
            invalid={invalid}
          />
        </a.div>
      ) : null}
    </>
  );
};

export default Field;
