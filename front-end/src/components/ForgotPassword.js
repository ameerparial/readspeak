import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { authStore } from "../store/auth.store";
import { useColor } from "../store/color.state";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = authStore();
  const { settingOptions } = useColor();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    try {
      await forgotPassword(email);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 text-center">
        {isSubmitted ? (
          <div>
            <FontAwesomeIcon
              icon={faEnvelope}
              className={`fa-5x text-${settingOptions.color} mb-4`}
            />

            <p className="lead">
              If your account with email {email} exists, you will shortly
              receive the email.
            </p>
          </div>
        ) : (
          <>
            <h2 className={`text-center mb-4 text-${settingOptions.color}`}>
              Forgot Password
            </h2>
            <p className="text-center mb-4">
              Enter your email address below, and we'll send you a link to reset
              your password.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="emailInput">Email address</label>
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className={`btn btn-${settingOptions.color} d-flex justify-content-center align-items-center`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
        <a
          className={`btn btn-link text-${settingOptions.color}`}
          href="/login"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
