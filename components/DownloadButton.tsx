import React, { useState, RefObject } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

// Declare the global libraries loaded via CDN to satisfy TypeScript
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

interface DownloadButtonProps {
  elementRef: RefObject<HTMLDivElement>;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ elementRef }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!elementRef.current) {
      console.error("Element to capture for PDF not found.");
      return;
    }

    setIsDownloading(true);

    try {
      const { jsPDF } = window.jspdf;
      const canvas = await window.html2canvas(elementRef.current, {
          useCORS: true, // This is important if your images are from another domain, which they are not here, but good practice.
          scale: 2, // Use a higher scale for better resolution in the PDF
          backgroundColor: '#111827' // Match the app's background color (bg-gray-900)
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p', // portrait
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = canvasWidth / pdfWidth;
      const imgHeight = canvasHeight / ratio;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add new pages if the comic is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save('ai-comic.pdf');

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Oops! Something went wrong while creating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70 text-lg"
      >
        {isDownloading ? (
          'Creating PDF...'
        ) : (
          <>
            <DownloadIcon className="h-6 w-6" />
            <span>Download as PDF</span>
          </>
        )}
      </button>
    </div>
  );
};
