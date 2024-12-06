import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { authStore } from "../store/auth.store";
import { useColor } from "../store/color.state";
import { toast } from "react-hot-toast";

const VerificationPage = () => {
  const [code, setCode] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  const { verifyUser, isLoading, error } = authStore();
  const { settingOptions } = useColor();

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  useEffect(() => {
    if (code.length === 6) setIsDisabled(false);
    else setIsDisabled(true);
  }, [code, isDisabled]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await verifyUser(code.trim());
      toast.success("Verification Successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6">
        <h2 className={`text-center mb-4 text-${settingOptions.color}`}>
          Verify Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="verificationCode"
              placeholder="Enter verification code"
              value={code}
              onChange={handleChange}
              required
            />
            <label htmlFor="verificationCode">Verification Code</label>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid mb-3">
            <button
              type="submit"
              className={`btn btn-${settingOptions.color} d-flex justify-content-center align-items-center`}
              disabled={isDisabled}
            >
              {isLoading ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="fa-spinner fa-spin"
                  aria-hidden="true"
                  style={{ animationDuration: "1s" }}
                />
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p>Didn't receive the code?</p>
          <button className={`btn btn-link text-${settingOptions.color}`}>
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
