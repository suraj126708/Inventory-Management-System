import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  const [scannedData, setScannedData] = useState("");
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10, // Higher FPS for better scanning
      qrbox: { width: 300, height: 300 }, // Adjust scan area size
      rememberLastUsedCamera: true, // Saves last used camera preference
      aspectRatio: 1.0, // Keeps correct aspect ratio
    });

    qrScanner.render(
      (decodedText) => {
        setScannedData(decodedText);
        qrScanner.clear(); // Stop scanning automatically after success
      },
      (error) => {
        console.log("Scanning error:", error);
      }
    );

    setScanner(qrScanner); // Store scanner instance for later cleanup

    return () => qrScanner.clear(); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>

      {/* QR Scanner Box (Only visible if no data is scanned yet) */}
      {!scannedData && (
        <div
          id="qr-reader"
          className="w-72 h-72 bg-white shadow-lg rounded-lg"
        ></div>
      )}

      {/* Display Scanned Result */}
      {scannedData && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded text-center w-64">
          <strong>Scanned Data:</strong> {scannedData}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
