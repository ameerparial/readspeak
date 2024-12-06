import { NavLink } from "react-router-dom";
import { authStore } from "../../store/auth.store";
import { useEffect, useState } from "react";
import { useUser } from "../../store/user.state";
const TopUserBar = () => {
  const { user } = authStore();
  const { username } = user;

  const { getProfileImage } = useUser();

  const [profileImage, setProfileImage] = useState(null);

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
  return (
    <ul className="d-flex justify-content-end border fixed-top topbar">
      <NavLink
        to={"profile"}
        className="nav-link m-1 d-flex align-items-center me-3"
      >
        <span className="me-1">{username}</span>
        <img src={profileImage} className="img" alt="profile" />
      </NavLink>
    </ul>
  );
};

export default TopUserBar;
