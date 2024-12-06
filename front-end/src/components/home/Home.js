import { useColor } from "../../store/color.state";
import { ReadIcon } from "../mysvgs";

const HomePage = () => {
  const { settingOptions, getHexaCode } = useColor();
  return (
    <div id="banner" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-flex align-items-center">
            <div id="banner-title">
              <h1 className={`title text-${settingOptions.color}`} id="heading">
                Welcome to ReadSpeak APP
              </h1>
              <p className={`lead`} id="ban-para">
                Immerse yourself in the world of literature with our innovative
                book and text reader application. Whether it's PDFs or plain
                text, experience the joy of reading at your fingertips.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex">
              <ReadIcon color={getHexaCode(settingOptions.color)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
