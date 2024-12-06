import {
  faBookOpenReader,
  faQuestion,
  faTrash,
  faUser,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useColor } from "../../../store/color.state";
import { useSpeakers } from "../../../store/speakers.state";
import { useUser } from "../../../store/user.state";
import { useMemo } from "react";
import { getSpeakersWithDetails } from "../../utils/utils";
const Dashboard = () => {
  const { settingOptions } = useColor();
  const { voices, readPDFs } = useUser();
  return (
    <>
      <div className="container">
        <div className="row">
          <Card
            number={543}
            title={"Available Voices"}
            color={settingOptions.color}
          />
          <Card number={139} title={"Languages"} color={settingOptions.color} />
          <Card
            number={readPDFs.length}
            title={"PDF Read"}
            color={settingOptions.color}
          />
          <Card number={5} title={"Users"} color={settingOptions.color} />
        </div>
        <div className="row mt-3">
          <ApplicationsTable voices={voices} />
        </div>
        <div className="row mt-3">
          <AdditionalFun color={settingOptions.color} />
        </div>
      </div>
    </>
  );
};

const ApplicationsTable = ({ voices }) => {
  const { bookMarkedSpeakers, setBookMarkedSpeakers } = useSpeakers();
  const { settingOptions } = useColor();

  const speakers = useMemo(() => {
    return getSpeakersWithDetails(voices, bookMarkedSpeakers);
  }, [bookMarkedSpeakers, voices]);

  return (
    <div className={`card bg-${settingOptions.theme}`}>
      <h4 className="my-4">Favorite</h4>
      {/* Bootstrap responsive wrapper for table */}
      <div className="table-responsive">
        {speakers.length > 0 ? (
          <table className="table table-borderless align-middle mytable">
            <thead className={``}>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Country</th>
                <th scope="col">Gender</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((favList, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={`https://i.pravatar.cc/40?img=${index + 1}`}
                        alt="avatar"
                        className="rounded-circle me-3"
                        width="40"
                        height="40"
                      />
                      <div>
                        <h6 className="mb-0">{favList.privDisplayName}</h6>
                      </div>
                    </div>
                  </td>
                  <td>{favList.privLocaleName}</td>
                  <td>{favList.privGender === 1 ? "Female" : "Male"}</td>

                  <td>
                    <div className="d-flex">
                      <button className="btn btn-outline-primary me-2">
                        <FontAwesomeIcon icon={faVolumeHigh} />
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                          setBookMarkedSpeakers(
                            favList.privShortName,
                            bookMarkedSpeakers
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span>You don't have favorite speakers yet.</span>
        )}
      </div>
    </div>
  );
};

const Card = ({ number, title, color }) => {
  return (
    <div className="col-12 col-md-6 col-lg-3 p-0">
      <div className="voice-card m-1 ms-0">
        <div className="card-body">
          <h5 className={`card-title fw-bold text-${color}`}>
            {number}
            {number !== 0 && (
              <span className="m-auto" style={{ fontSize: "0.6em" }}>
                +
              </span>
            )}
          </h5>
          <p className="card-text text-muted">{title}</p>
        </div>
      </div>
    </div>
  );
};

// const FavoriteArtists = () => {
//   const users = [
//     {
//       id: 1,
//       name: "Michael Holz",

//       status: "Completed",
//       image: "https://via.placeholder.com/150",
//     },
//     {
//       id: 2,
//       name: "Paula Wilson",

//       status: "Cancelled",
//       image: "https://via.placeholder.com/150",
//     },
//     {
//       id: 3,
//       name: "Antonio Moreno",

//       status: "Pending",
//       image: "https://via.placeholder.com/150",
//     },
//     {
//       id: 4,
//       name: "Mary Saveley",

//       status: "Completed",
//       image: "https://via.placeholder.com/150",
//     },
//     {
//       id: 5,
//       name: "Martin Sommer",

//       status: "Completed",
//       image: "https://via.placeholder.com/150",
//     },
//   ];

//   return (
//     <table className="table bg-white shadow table-hover">
//       <thead>
//         <tr>
//           <th>Artist</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {users.map((user) => (
//           <tr key={user.id}>
//             <td>
//               <div className="d-flex align-items-center">
//                 <img src={user.image} alt={user.name} width="40" height="40" />
//                 <span className="ms-2">{user.name}</span>
//               </div>
//             </td>

//             <td>
//               <button className="btn btn-outline-danger btn-sm">
//                 <FontAwesomeIcon icon={faTrash} /> Remove
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

const AdditionalFun = ({ color }) => {
  const apps = [
    {
      name: "Take Quiz",
      icon: faQuestion,
      link: "/quiz",
    },
    {
      name: "Dictionary",
      icon: faBookOpenReader,
      link: "/registeruser/words",
    },
    {
      name: "Edit Profile",
      icon: faUser,
      link: "/registeruser/profile",
    },
    { name: "Speakers", icon: faVolumeHigh, link: "/registeruser/speakers" },
  ];
  return (
    <>
      <div className="d-flex flex-wrap gap-3 mb-5">
        {apps.map((app, index) => (
          <NavLink
            className={`voice-card p-3 gap-2 align-items-center text-decoration-none text-${color}`}
            to={app.link}
            key={`app ${index}`}
          >
            <FontAwesomeIcon icon={app.icon} />

            <div>{app.name}</div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
