import React, { useState } from "react";
import { useColor } from "../../store/color.state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useUser } from "../../store/user.state";

const ContactInfo = () => {
  const { settingOptions } = useColor();
  return (
    <div className="container mt-5">
      <h2 className={`display-4 text-${settingOptions.color} text-center`}>
        Contact us
      </h2>
      <div className={`row bg-${settingOptions.theme}`}>
        <div className="col-md-6 mb-4">
          <div className={`card border-0 bg-${settingOptions.theme}`}>
            <div className="card-body">
              <h5 className="card-title">Phone Support</h5>
              <p className="card-text">
                For immediate assistance, call us at:
                <br />
                <strong>(+92) 456-7890</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className={`card border-0 bg-${settingOptions.theme}`}>
            <div className="card-body">
              <h5 className="card-title">Email Support</h5>
              <p className="card-text">
                For non-urgent inquiries, please email us at:
                <br />
                <strong>
                  <a href="mailto:support@example.com">help@readspeak.com</a>
                </strong>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-12 mb-4">
          <div className={`card border-0 bg-${settingOptions.theme}`}>
            <div className="card-body">
              <h5 className="card-title">Visit Us</h5>
              <p className="card-text">
                Our office is located at:
                <br />
                <strong>Sukkur IBA University Main Campus</strong>
                <br />
                Sukkur, Pakistan
              </p>
            </div>
          </div>
        </div>
      </div>

      <MessagePopup color={settingOptions.color} bg={settingOptions.theme} />
    </div>
  );
};

const MessagePopup = ({ color, bg }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const { sendMessage } = useUser();

  // Toggle popup visibility
  const togglePopup = () => setShowPopup(!showPopup);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      sendMessage(message, email);
      toast.success("Message is sent Successfully");
    } catch (err) {
      toast.error("Error occured while sending the message.");
    }

    setMessage("");
    setShowPopup(false);
  };

  return (
    <>
      {/* Floating Message Icon */}
      <div className="position-fixed bottom-0 end-0 m-4">
        <button
          className={`btn btn-${color} rounded-circle shadow-lg`}
          style={{ width: "40px", height: "40px" }}
          onClick={togglePopup}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          {/* <i className="fas fa-envelope fa-lg"></i> */}
        </button>
      </div>

      {/* Message Popup */}
      {showPopup && (
        <div
          className={`position-fixed bottom-0 end-0 m-4 p-4 border shadow-lg bg-${bg}`}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">Send a Message</h5>
            <button className={`btn p-1 text-danger`} onClick={togglePopup}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={`btn btn-${color} w-100`}>
              Send Message
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ContactInfo;
