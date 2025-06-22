import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set workerSrc using the CDN approach
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <Document
        file={pdfUrl}
        onLoadError={(err) => console.error("PDF load error:", err)}
      >
        <Page pageNumber={1} width={600} />
      </Document>
    </div>
  );
};

export default PDFViewer;
