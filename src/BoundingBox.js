const BoundingBox = ({ height, width, invalid }) => {
  return (
    <div
      style={{
        border: "1px solid blue",
        borderColor: invalid ? "red" : "blue",
        height: "100%",
        width: "100%",
        position: "relative"
      }}
    >
      <div
        style={{
          border: "1px solid blue",
          borderColor: invalid ? "red" : "blue",
          height: "7px",
          width: "7px",
          top: "-5px",
          left: width / 2 - 5,
          position: "absolute",
          background: invalid ? "red" : "blue"
        }}
      />
      <div
        style={{
          border: "1px solid blue",
          borderColor: invalid ? "red" : "blue",
          height: "7px",
          width: "7px",
          bottom: "-5px",
          left: width / 2 - 5,
          position: "absolute",
          background: invalid ? "red" : "blue"
        }}
      />
      <div
        style={{
          border: "1px solid blue",
          borderColor: invalid ? "red" : "blue",
          height: "7px",
          width: "7px",
          top: height / 2 - 5,
          left: "-5px",
          position: "absolute",
          background: invalid ? "red" : "blue"
        }}
      />
      <div
        style={{
          border: "1px solid blue",
          borderColor: invalid ? "red" : "blue",
          height: "7px",
          width: "7px",
          top: height / 2 - 5,
          right: "-5px",
          position: "absolute",
          background: invalid ? "red" : "blue"
        }}
      />
    </div>
  );
};

export default BoundingBox;
