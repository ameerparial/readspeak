import {
  faCompress,
  faExpand,
  faMoon,
  faSliders,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useColor } from "../store/color.state";

const ColorSettings = () => {
  const { setSettingOptions, settingOptions } = useColor();

  const toggleScreenSize = () => {
    const toggleValue = !settingOptions.isFullScreen;
    const value = { ...settingOptions, isFullScreen: toggleValue };
    setSettingOptions(value);
    localStorage.setItem("setting", JSON.stringify(value));
  };

  const handleMode = (mode) => {
    const setting = JSON.parse(localStorage.getItem("setting"));
    let value = {};
    if (!setting) {
      value["theme"] = mode;
    } else {
      value = { ...setting, theme: mode };
    }
    localStorage.setItem("setting", JSON.stringify(value));
    setSettingOptions(value);
  };
  const handleColor = (color) => {
    const setting = JSON.parse(localStorage.getItem("setting"));
    let value = {};
    if (!setting) {
      value["color"] = color;
    } else {
      value = { ...setting, color };
    }
    localStorage.setItem("setting", JSON.stringify(value));
    setSettingOptions(value);
  };
  return (
    <>
      <nav
        className={`navbar position-fixed color-setting shadow m-0`}
        style={{
          top: "50%",
          right: "0",
          borderRadius: "40px 0px 0px 40px",
          zIndex: "1031",
        }}
      >
        <div className="container">
          {/* Side bar */}
          <div className="navbar-nav">
            <div
              className={`offcanvas offcanvas-end m-2 rounded`}
              tabIndex="-1"
              id="colorSelectorID"
              aria-labelledby="offcanvasNavbarLabel"
            >
              {/* header*/}
              <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                  Color Setting
                </h5>
                {/* Close btn */}
                <button
                  type="button"
                  className="btn-close border-0 shadow-none"
                  data-bs-dismiss="offcanvas"
                ></button>
              </div>
              {/* Body */}
              <div className="offcanvas-body">
                {/* mode */}
                <div>
                  <h5>Mode</h5>
                  <div className="d-flex justify-content-center gap-3">
                    <CardItem
                      text={"text-primary"}
                      bg={"light"}
                      icon={faSun}
                      iconColor={settingOptions.color}
                      onClick={handleMode}
                    />
                    <CardItem
                      text={"text-primary"}
                      bg={"dark"}
                      icon={faMoon}
                      iconColor={settingOptions.color}
                      onClick={handleMode}
                    />
                  </div>
                </div>
                {/* Color Setting */}
                <div className="my-3">
                  <h5>Color</h5>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <Color
                      colorClass={"info"}
                      bgColor={`bg-${setSettingOptions.theme}`}
                      handleColor={handleColor}
                    />
                    <Color
                      colorClass={"warning"}
                      bgColor={`bg-${setSettingOptions.theme}`}
                      handleColor={handleColor}
                    />
                    <Color
                      colorClass={"success"}
                      bgColor={`bg-${setSettingOptions.theme}`}
                      handleColor={handleColor}
                    />
                    <Color
                      colorClass={"danger"}
                      bgColor={`bg-${setSettingOptions.theme}`}
                      handleColor={handleColor}
                    />
                    <Color
                      colorClass={"primary"}
                      bgColor={`bg-${setSettingOptions.theme}`}
                      handleColor={handleColor}
                    />
                    <Color
                      colorClass={"secondary"}
                      bgColor={`bg-${setSettingOptions.theme}`}
                      handleColor={handleColor}
                    />
                  </div>
                </div>
                {/* Full Screen */}
                <div
                  className="mx-5 d-flex align-items-center gap-2 justify-content-center p-3 border"
                  onClick={toggleScreenSize}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={settingOptions.isFullScreen ? faCompress : faExpand}
                  />
                  {settingOptions.isFullScreen && "Exit"} Full Screen
                </div>
              </div>
            </div>
          </div>

          <button
            className={`navbar-toggler border-0 shadow-none p-1 text-${settingOptions.color}`}
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#colorSelectorID"
            aria-controls="colorSelectorID"
          >
            <FontAwesomeIcon icon={faSliders} />
          </button>
        </div>
      </nav>
    </>
  );
};

const CardItem = ({ text, bg, icon, iconColor, onClick }) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center shadow rounded bg-${bg} ${text}`}
      style={{ width: "100px", height: "80px" }}
      onClick={() => onClick(bg)}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`text-${iconColor}`}
        style={{ fontSize: "larger" }}
      />
    </div>
  );
};
const Color = ({ colorClass, bgColor, handleColor }) => {
  return (
    <div
      className={`shadow ${bgColor} border rounded d-flex align-items-center justify-content-center`}
      style={{ width: "30%", height: "60px", cursor: "pointer" }}
      onClick={() => handleColor(colorClass)}
    >
      <div
        className={`bg-${colorClass}`}
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "10px 50px",
        }}
      />
    </div>
  );
};
export default ColorSettings;
