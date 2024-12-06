import "../styles/speedmeter.css";

const SpeedRange = ({ handleSpeedShow, speed, color, changeSpeed }) => {
  const handleSpeedChange = (e) => {
    const speedValue = Number(e.target.value);
    changeSpeed(speedValue);
  };

  const increaseSpeed = () => {
    const increasedSpeed = (speed + 0.05).toFixed(2);
    const speedValue = Math.min(increasedSpeed, 2);
    changeSpeed(speedValue);
    // const speedValue = parseFloat(speed / 180).toFixed(2);
    // changeSpeed(speedValue);
  };

  const decreaseSpeed = () => {
    const decreasedSpeed = (speed - 0.05).toFixed(2);
    const speedValue = Math.max(decreasedSpeed, 0.25);
    changeSpeed(speedValue);
    // const speedValue = parseFloat(speed / 180).toFixed(2);
    // changeSpeed(speedValue);
  };

  return (
    <div className="shadow-lg p-2 controller-list">
      <div className="d-flex justify-content-between border p-2">
        <h5>Speed</h5>
        <button className="btn btn-close" onClick={handleSpeedShow} />
      </div>
      <div className="speed-range-container">
        <div className="speed-display">
          <p className={`text-${color}`}>Selected Speed: {speed}X</p>
        </div>
        <div className="d-flex flex-column align-items-start gap-1">
          <button
            className={`btn btn-outline-${color} d-flex align-items-center justify-content-center`}
            onClick={increaseSpeed}
            style={{ width: "50px", height: "20px" }}
          >
            +
          </button>
          <div className="d-flex align-items-center">
            <div className="vertical-slider-container">
              <input
                type="range"
                className="form-range vertical-slider"
                min="0.25"
                max="2"
                value={speed}
                step="0.05"
                onChange={handleSpeedChange}
              />
            </div>
            <div className="speed-labels">
              <div className="speed-label">2.00x </div>
              <div className="speed-label">1.75x </div>
              <div className="speed-label">1.50x</div>
              <div className="speed-label">1.25x</div>
              <div className="speed-label">1.00x</div>
              <div className="speed-label">0.75x</div>
              <div className="speed-label">0.5x </div>
              <div className="speed-label">0.25x</div>
            </div>
          </div>
          <button
            className={`btn btn-outline-${color} d-flex align-items-center justify-content-center`}
            onClick={decreaseSpeed}
            style={{ width: "50px", height: "20px" }}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeedRange;
