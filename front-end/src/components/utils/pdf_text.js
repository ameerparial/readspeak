import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

export function extractText(file, setPdfText) {
  try {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);

      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      let text_ = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();

        text.items.forEach((item) => {
          text_ += `${item.str} `;
        });
      }
      setPdfText(text_);
    };
  } catch (err) {
    console.log(err.message);
  }
}
