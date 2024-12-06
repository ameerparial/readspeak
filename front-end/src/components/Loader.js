import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useColor } from "../store/color.state";

const Loader = () => {
  const { settingOptions } = useColor();
  return (
    <div className="position-fixed top-0 w-100 vh-100 d-flex justify-content-center align-items-center">
      <div className={`text-${settingOptions.color}`}>
        <FontAwesomeIcon
          icon={faSpinner}
          className="fa-spin me-1"
          style={{
            animationDuration: "0.75s",
            fontSize: "20px",
          }}
        />
        <span style={{ fontSize: "20px" }}>Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
