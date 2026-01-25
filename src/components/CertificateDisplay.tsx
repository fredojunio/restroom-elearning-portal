"use client";

import { Certificate } from "@prisma/client";

interface CertificateDisplayProps {
  certificate: Certificate;
}

export function CertificateDisplay({ certificate }: CertificateDisplayProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById("certificate");
    if (element) {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 1200, 800);
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#1e40af";
        ctx.textAlign = "center";
        ctx.fillText("Certificate of Completion", 600, 200);
        ctx.font = "24px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(`This is to certify that`, 600, 320);
        ctx.fillText(`${certificate.id}`, 600, 380);
        ctx.fillText(`has successfully completed`, 600, 440);
        ctx.fillText(`${certificate.moduleName}`, 600, 500);
        ctx.fillText(
          `Certificate #: ${certificate.certificateNumber}`,
          600,
          700,
        );
        const link = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = link;
        downloadLink.download = "certificate.png";
        downloadLink.click();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div
        id="certificate"
        className="bg-gradient-to-br from-yellow-50 to-blue-50 border-8 border-blue-900 p-12 rounded-lg shadow-2xl text-center"
      >
        <div className="mb-8">
          <svg
            className="w-16 h-16 mx-auto text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Certificate of Completion
        </h1>

        <p className="text-lg text-gray-700 mb-8">This is to certify that</p>

        <div className="border-b-4 border-blue-900 py-4 mb-8">
          <p className="text-3xl font-bold text-blue-900">
            Student ID: {certificate.userId}
          </p>
        </div>

        <p className="text-lg text-gray-700 mb-2">
          has successfully completed the learning module
        </p>

        <p className="text-2xl font-bold text-blue-900 mb-8">
          {certificate.moduleName}
        </p>

        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Certificate Number</p>
            <p className="font-mono font-bold">
              {certificate.certificateNumber}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Issued Date</p>
            <p className="font-bold">
              {new Date(certificate.issuedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <p className="text-gray-600 italic mb-12">
          Valid for 1 year from the date of issue
        </p>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Print Certificate
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
}
