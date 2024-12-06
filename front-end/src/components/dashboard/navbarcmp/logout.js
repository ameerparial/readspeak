import { authStore } from "../../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useSpeakers } from "../../../store/speakers.state";

const Logout = () => {
  const { logout } = authStore();
  const { saveToDatabase, bookMarkedSpeakers } = useSpeakers();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      console.log("Users to save in database and clear session storage");
      console.log(bookMarkedSpeakers);
      // saveToDatabase(bookMarkedSpeakers);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Are you sure you want to logout?</h1>
      <button
        type="button"
        className="btn btn-danger shadow"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
};

export default Logout;
