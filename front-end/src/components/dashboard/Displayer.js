import { useParams } from "react-router-dom";
import Logout from "./navbarcmp/logout";
import Profile from "./navbarcmp/profile";
import Read from "./navbarcmp/read";
import Dashboard from "./navbarcmp/Dashboard";
import Speakers from "./navbarcmp/Speakers";
import { authStore } from "../../store/auth.store";
import { useEffect } from "react";

import { useUser } from "../../store/user.state";
import PDFRead from "./navbarcmp/PDFRead";
import Dictionary from "./navbarcmp/Words";

const Displayer = () => {
  const { routeID } = useParams();
  const { user } = authStore();
  const { getVoices, getPDFs } = useUser();

  useEffect(() => {
    (async function () {
      try {
        await getVoices();
      } catch (err) {
        console.log(err.message);
      }
    })();

    (async function () {
      try {
        await getPDFs();
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, [getVoices]);

  switch (routeID) {
    case "dashboard":
      return <Dashboard />;
    case "read":
      return <Read user={user} />;
    case "speakers":
      return <Speakers />;
    case "words":
      return <Dictionary />;
    case "pdfs":
      return <PDFRead />;
    case "profile":
      return <Profile user={user} />;
    case "logout":
      return <Logout user={user} />;
    default:
      return <h1>404 Page not found</h1>;
  }
};

export default Displayer;
