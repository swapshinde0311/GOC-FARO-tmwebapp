import React from "react";

import PropTypes from "prop-types";
import "./../../../CSS/styles.css";

const SvgCircle = (props) => {
  //const [offset, setOffset] = useState(0);
  //const circleRef = useRef(null);
  const { size, progress, strokeWidth, circleOneStroke } = props;

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  //const circumference = 2 * Math.PI * radius;
  //const offset = ((100 - progress) / 100) * circumference;
  // useEffect(() => {
  //   const progressOffset = ((100 - progress) / 100) * circumference;
  //   setOffset(progressOffset);
  //   circleRef.current.style =
  //     "transition: stroke-dashoffset 850ms ease-in-out;";
  // }, [setOffset, circumference, progress, offset]);

  return (
    <>
      <svg className="svg" width={size} height={size}>
        <circle
          className="svg-circle-bg"
          stroke={circleOneStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <text x={`${center}`} y={`${center + 10}`} className="svg-circle-text">
          {progress}
        </text>
      </svg>
    </>
  );
};

SvgCircle.propTypes = {
  size: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  circleOneStroke: PropTypes.string.isRequired,
};

export default SvgCircle;
