import { useState } from "react";
import { HomeLogo, RegistrationSvg } from "./mysvgs";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";

import { authStore } from "../store/auth.store";
import { useColor } from "../store/color.state";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const RegisterPage = () => {
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { signup, isLoading, error } = authStore();
  const [showPass, setShowPass] = useState(false);
  const { settingOptions, getHexaCode } = useColor();

  const handleChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    setUser((prevUser) => ({ ...prevUser, [key]: value }));
  };
  const handleSubmitForm = async (event) => {
    event.preventDefault();
    // Here is the user's data

    if (user.password !== user.confirmPassword) {
      return toast.error("Password mismatched.");
    }
    try {
      await signup(user);
      navigate("/verifyuser");
      toast.success("Your account created.");
    } catch (_) {
      toast.error(error);
    }
  };
  return (
    <>
      <div className="container-fluid">
        <a
          href="/"
          className="position-absolute"
          style={{
            top: "10px",
            left: "40px",
          }}
        >
          <HomeLogo
            color={getHexaCode(settingOptions.color)}
            width={"50.000000pt"}
            height={"50.000000pt"}
          />
        </a>
        <div className="row">
          <div className="col-md-6 d-md-flex d-none">
            <div
              className={`d-flex justify-content-start align-items-center w-100 m-2 rounded bg-${
                settingOptions.theme === "dark" ? "dark" : "white"
              } shadow-lg mt-2`}
            >
              <RegistrationSvg
                color={getHexaCode(settingOptions.color)}
                width={"744"}
                height={"400"}
              />
            </div>
          </div>

          <div className="col-md-6">
            <form className="px-5" onSubmit={handleSubmitForm}>
              <h1
                className={`my-md-4 mt-5 pt-3 ms-3 text-${settingOptions.color}`}
              >
                Create a new Account
              </h1>
              <div className="form-floating m-3">
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  placeholder="Enter your Email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="emailInput">Enter your email</label>
              </div>

              <div className="form-floating m-3">
                <input
                  type="text"
                  className="form-control"
                  id="usernameInput"
                  placeholder="Enter your username"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="usernameInput">Enter your username</label>
              </div>

              <div className="form-floating m-3">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  id="passwordInput"
                  placeholder="Enter Password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="passwordInput">Enter Password</label>
                <FontAwesomeIcon
                  icon={showPass ? faEyeSlash : faEye}
                  className="icon"
                  onClick={() => setShowPass(!showPass)}
                />
              </div>
              <div className="form-floating m-3">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  id="confirmPasswordInput"
                  placeholder="Confirm your Password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="confirmPasswordInput">Confirm Password</label>
                <FontAwesomeIcon
                  icon={showPass ? faEyeSlash : faEye}
                  className="icon"
                  onClick={() => setShowPass(!showPass)}
                />
              </div>
              <div className="form-floating m-3">
                <button
                  className={`btn btn-${settingOptions.color} shadow-lg w-100`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="fa-spinner fa-spin"
                      aria-hidden="true"
                      style={{ animationDuration: "1s" }}
                    />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
              <div className="d-flex justify-content-center gap-1">
                <p>Already have Account </p>
                <a
                  href={"/login"}
                  className={`text-decoration-none text-${settingOptions.color}`}
                >
                  Click here to login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
