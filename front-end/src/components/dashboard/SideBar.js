import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faMicrophone,
  faVolumeUp,
  faFileWord,
  faFilePdf,
  faUser,
  faSignOutAlt,
  faAnglesRight,
  faAnglesLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const [isDragged, setIsDragged] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.documentElement.style.setProperty("--left-space", "60px");
        setIsDragged(false);
      } else {
        document.documentElement.style.setProperty("--left-space", "200px");
        setIsDragged(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleArrowBtn = () => {
    const value = isDragged ? "60px" : "200px";
    document.documentElement.style.setProperty("--left-space", value);
    setIsDragged(!isDragged);
  };

  return (
    <div className={`child1 ${isDragged ? "" : "smallItem"}`}>
      <div className="fixed-me shadow-lg">
        <div className="header">
          <FontAwesomeIcon
            icon={isDragged ? faAnglesRight : faAnglesLeft}
            className="d-md-block d-none mt-2 me-2 arrowicon"
            onClick={handleArrowBtn}
          />
        </div>
        <ul className="navbar-items">
          <li className="nav-item">
            <NavLink to={"dashboard"} className="nav-link">
              <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"read"} className="nav-link">
              <FontAwesomeIcon icon={faMicrophone} className="icon" />
              Read
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"speakers"} className="nav-link">
              <FontAwesomeIcon icon={faVolumeUp} className="icon" />
              Speakers
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"words"} className="nav-link">
              <FontAwesomeIcon icon={faFileWord} className="icon" />
              Words
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"pdfs"} className="nav-link">
              <FontAwesomeIcon icon={faFilePdf} className="icon" />
              PDFs
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"profile"} className="nav-link">
              <FontAwesomeIcon icon={faUser} className="icon" />
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"logout"} className="nav-link">
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
