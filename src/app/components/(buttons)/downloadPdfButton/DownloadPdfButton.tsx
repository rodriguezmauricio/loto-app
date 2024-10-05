// /components/DownloadPDFButton.tsx

import React from "react";

const DownloadPDFButton: React.FC = () => {
  const generatePDF = async () => {
    try {
      const response = await fetch("/src/app/api/generatePdf/generatePdf.tsx");
      const blob = await response.blob();

      // Create a link element to download the PDF
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "results-cards.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return <button onClick={generatePDF}>Download Results Cards PDF</button>;
};

export default DownloadPDFButton;
