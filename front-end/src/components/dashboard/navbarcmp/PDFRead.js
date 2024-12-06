import { faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useColor } from "../../../store/color.state";
import { useUser } from "../../../store/user.state";

const PDFRead = () => {
  const { readPDFs, deletePDF, openPDF } = useUser();
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { settingOptions } = useColor();

  useEffect(() => {
    console.log("PDF Changes");
    console.log(readPDFs);
    setPdfs(readPDFs);
  }, [readPDFs]);

  const removePDF = async (index) => {
    try {
      setIsLoading(true);
      await deletePDF(readPDFs[index]);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container my-4">
      <div className="card p-4 shadow controller-list">
        <h4 className="mb-4">Read PDFs</h4>
        {pdfs.length > 0 ? (
          <div className="list-group">
            {pdfs.map((pdf, index) => (
              <div
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5
                    onClick={() => openPDF(pdf.filePath)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className={`text-${settingOptions.color} me-2`}
                    />
                    {pdf.fileName}
                  </h5>
                  <p className="mb-1">
                    Size: {Math.round(Number(pdf.fileSize) / 1000)}kb
                  </p>
                  <p className="mb-0">Date Read: {pdf.uploadDate}</p>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    removePDF(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No PDFs read yet.</p>
        )}
      </div>
    </div>
  );
};

export default PDFRead;
