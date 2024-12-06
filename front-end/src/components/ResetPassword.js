import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authStore } from "../store/auth.store";
import { useColor } from "../store/color.state";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [btnText, setBtnText] = useState("Reset Password");
  const navigate = useNavigate();
  const { token } = useParams();

  const { isLoading, error, resetPassword } = authStore();
  const { settingOptions } = useColor();

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Calling api here
      await resetPassword(token, password);
      toast.success("Password Reset Successfully");
      setBtnText("Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6">
        <h2 className={`text-center text-${settingOptions.color} mb-4`}>
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              id="passwordInput"
              placeholder="Enter new password"
              value={password}
              onChange={handleChangePassword}
              required
            />
            <label htmlFor="passwordInput">New Password</label>
            <FontAwesomeIcon
              icon={showPass ? faEyeSlash : faEye}
              className="icon"
              onClick={() => setShowPass(!showPass)}
            />
          </div>

          <div className="form-floating mb-3">
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              id="confirmPasswordInput"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              required
            />
            <label htmlFor="confirmPasswordInput">Confirm New Password</label>
            <FontAwesomeIcon
              icon={showPass ? faEyeSlash : faEye}
              className="icon"
              onClick={() => setShowPass(!showPass)}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid mb-3">
            <button
              type="submit"
              className={`btn btn-${settingOptions.color} d-flex justify-content-center align-items-center`}
              disabled={isLoading}
            >
              {isLoading ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="fa-spin"
                  aria-hidden="true"
                  style={{ animationDuration: "1s" }}
                />
              ) : (
                btnText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
