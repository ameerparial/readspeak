import { useEffect, useState } from "react";
import { useColor } from "../../../store/color.state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useUser } from "../../../store/user.state";

function Profile({ user }) {
  const [username, setUsername] = useState(user.username);
  const [file, setFile] = useState(null);
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  // It is is to show the profile
  const [profileImage, setProfileImage] = useState(null);
  const { settingOptions } = useColor();

  const { updateProfile, getProfileImage } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        const imageUrl = await getProfileImage(user.profile);
        setProfileImage(imageUrl);
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, [getProfileImage, user.profile]);

  const onChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        setIsProfileChanged(true);
      };
      reader.readAsDataURL(file);
    } else {
      setIsProfileChanged(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      const isUsernameChanged =
        user?.username.trim().toLowerCase() !== username.trim().toLowerCase();

      if (!isUsernameChanged && !isProfileChanged)
        return alert("No fields are changed");

      if (isUsernameChanged) {
        console.log("User name is updated");
        formData.set("username", username);
        console.log(username);
      }

      if (isProfileChanged) {
        console.log("Profile is Updated");
        formData.set("profile-image", file);
      }

      // console.log("FormData ...");
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      await updateProfile(formData);
      // On successfully updated.
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="">
          <ImageUploader
            color={settingOptions.color}
            profileImage={profileImage}
          />
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onChange}
            />
            <div className="form-floating m-1">
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="Enter Email Address"
                value={user?.email}
                disabled
              />
              <label htmlFor="emailInput">Email address</label>
            </div>
            <div className="form-floating m-1">
              <input
                type="text"
                className="form-control"
                id="usernameInput"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="usernameInput">Username</label>
            </div>

            <button
              type="submit"
              className={`btn btn-${settingOptions.color} shadow ms-1 ${
                isLoading && "disabled"
              }`}
            >
              {isLoading ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="fa-spinner fa-spin"
                  aria-hidden="true"
                  style={{ animationDuration: "1s" }}
                />
              ) : (
                "Update"
              )}
            </button>
          </form>
        </div>
        <div className="">
          <ModifyPassword color={settingOptions.color} />
          <DeleteAccount useremail={user?.email} />
        </div>
      </div>
    </div>
  );
}

const ImageUploader = ({ color, profileImage }) => {
  return (
    //  p-1 align-items-center gap-3 form-control
    <div className="d-flex justify-content-center">
      <div className="position-relative">
        <img
          src={profileImage ? profileImage : "https://via.placeholder.com/150"}
          className="rounded-circle shadow border"
          style={{ width: "100px", height: "100px" }}
          alt="not found!"
        />
        <label htmlFor="profile-image" id="geLabel">
          <FontAwesomeIcon
            icon={faCamera}
            className="color-change"
            style={{
              position: "absolute",
              bottom: "4px",
              right: "0px",
              cursor: "pointer",
            }}
          />
        </label>
      </div>
    </div>
  );
};

const DeleteAccount = () => {
  const [isEmailCorrect, setIsEmailCorrect] = useState(false);
  const { deleteAccount } = useUser();

  const handleEmailChange = (event) => {
    const value = event.target.value.trim();
    if (value.toLowerCase() === "delete") setIsEmailCorrect(true);
    else setIsEmailCorrect(false);
  };

  const handleAccountDelete = async (event) => {
    event.preventDefault();
    try {
      const result = await deleteAccount();
      toast.success(result);
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="my-3">
      <h3>Deleting account</h3>
      <p>
        Deleting your account will remove all of your information from our
        database. This cannot be undone.
      </p>
      <div className="">
        <label htmlFor="emailInput" className="styles-text">
          To confirm this, type "DELETE"
        </label>

        <div className="d-flex gap-1 ">
          <input
            type="text"
            className="form-control"
            onChange={handleEmailChange}
          />

          <button
            className={`btn btn-danger ${!isEmailCorrect && "disabled"}`}
            onClick={handleAccountDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ModifyPassword = ({ color }) => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { modifyPassword, isLoading } = useUser();

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setData((d) => ({ ...d, [key]: value }));
  };
  const handleModifyPassword = async (event) => {
    event.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("Password Mismatched.");
    }
    try {
      const result = await modifyPassword(data);
      toast.success(result);
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div className="my-3">
      <h5>Change Password</h5>
      <form onSubmit={handleModifyPassword}>
        <div className="form-floating my-2">
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            placeholder="Old Password"
            name="oldPassword"
            value={data?.oldPassword}
            onChange={handleChange}
            required
          />
          <label htmlFor="passwordInput">Old Password</label>
        </div>

        {/* New Password */}
        <div className="form-floating my-2">
          <input
            type="password"
            className="form-control"
            id="newPassword"
            placeholder="New Password"
            name="newPassword"
            value={data?.newPassword}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirmInput">New Password</label>
        </div>

        {/* Confirm Password */}
        <div className="form-floating my-2">
          <input
            type="password"
            className="form-control"
            id="confirmInput"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={data?.confirmPassword}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirmInput">Confirm Password</label>
        </div>

        {/* Modify Password */}
        <button
          type="submit"
          className={`btn btn-${color} shadow ${isLoading && "disabled"}`}
        >
          {isLoading ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className="fa-spinner fa-spin"
              aria-hidden="true"
              style={{ animationDuration: "1s" }}
            />
          ) : (
            "Change"
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
