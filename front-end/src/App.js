import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardContainer from "./components/dashboard/Displayer";
import User from "./components/dashboard/User";
import RegisterPage from "./components/Register";
import LoginPage from "./components/Login";
import Navbar from "./components/home/Navbar";
import ContactInfo from "./components/home/Contact";
import About from "./components/home/About";
import HomePage from "./components/home/Home";
import ColorSettings from "./components/ColorSettings";
import VerificationPage from "./components/VerifyUser";
import { Toaster } from "react-hot-toast";
import { authStore } from "./store/auth.store";
import { useEffect } from "react";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Loader from "./components/Loader";
import { useColor } from "./store/color.state";
import Quiz from "./components/dashboard/navbarcmp/Quiz";
import PageNotFound from "./components/NotFound";

function ProtectRoutes({ children }) {
  const { isAuthenticated, user } = authStore();

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }
  if (!user.isVerified) {
    // If not verified move to verify page
    return <Navigate to={"/verifyuser"} replace />;
  }
  return children;
}

function RedirectRoute({ children }) {
  const { isAuthenticated, user } = authStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to={"/registeruser/dashboard"} replace />;
  }

  return children;
}

function App() {
  const { isCheckingAuth, checkAuth } = authStore();
  const { settingOptions, getHexaCode } = useColor();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--active-color",
      getHexaCode(settingOptions.color)
    );
    console.log(settingOptions.theme);

    document.documentElement.setAttribute("data-theme", settingOptions?.theme);
    // document.documentElement.style.setProperty("--theme", theme);

    // if (settingOptions.isFullScreen) {
    //   // console.log("Set full screen");
    // } else {
    //   console.log("Set exit screen");
    // }
  }, [settingOptions, getHexaCode]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loader />;
  }
  return (
    <>
      <ColorSettings />
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<h1>Testing Component</h1>}></Route>
          <Route path="/verifyuser" element={<VerificationPage />} />
          <Route path="/" element={<Navbar />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/About" element={<About />} />
            <Route path="/contact" element={<ContactInfo />} />
          </Route>
          <Route
            path="/login/forgotpassword"
            element={
              <RedirectRoute>
                <ForgotPassword />
              </RedirectRoute>
            }
          />

          <Route
            path="/register"
            element={
              <RedirectRoute>
                <RegisterPage />
              </RedirectRoute>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectRoute>
                <LoginPage />
              </RedirectRoute>
            }
          />
          <Route
            path="registeruser"
            element={
              <ProtectRoutes>
                <User />
              </ProtectRoutes>
            }
          >
            <Route path=":routeID" Component={DashboardContainer} />
          </Route>
          <Route
            path="/reset-password/:token"
            element={
              <RedirectRoute>
                <ResetPassword />
              </RedirectRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectRoutes>
                <Quiz />
              </ProtectRoutes>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
