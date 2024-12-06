import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useColor } from "../../store/color.state";
import { HomeLogo } from "../mysvgs";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { settingOptions, getHexaCode } = useColor();

  useEffect(() => {
    const handleScroll = () => {
      const scrollLimit = 80; // Adjust this value to your needs
      if (window.scrollY > scrollLimit) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          isScrolled ? "border-bottom shadow bg-white" : ""
        }`}
      >
        <div className="container">
          <a className="navbar-brand" href="/">
            <HomeLogo
              color={getHexaCode(settingOptions.color)}
              width={"75"}
              height={"50"}
            />
          </a>

          {/* Side bar */}
          <div
            className="offcanvas offcanvas-start p-2"
            tabIndex="-1"
            id="sideNavbarID"
            aria-labelledby="offcanvasNavbarLabel"
          >
            {/* header*/}
            <div className="offcanvas-header border-bottom">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                ReadSpeak
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
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item ms-3" data-bs-dismiss="offcanvas">
                  <NavLink to={"/"} className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item ms-3" data-bs-dismiss="offcanvas">
                  <NavLink to={"about"} className="nav-link">
                    About
                  </NavLink>
                </li>
                <li className="nav-item ms-3" data-bs-dismiss="offcanvas">
                  <NavLink to={"contact"} className="nav-link">
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sideNavbarID"
              aria-controls="sideNavbarID"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="buttons d-flex gap-1">
              <NavLink
                to="login"
                className={`btn btn-${settingOptions.color} shadow-lg`}
              >
                Login
              </NavLink>
              <NavLink
                to="register"
                className={`btn btn-${settingOptions.color} shadow-lg`}
              >
                Register
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="w-100 content mt-5">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Navbar;
