import React, { useState } from 'react';
import Papa from 'papaparse';

const CsvUploader = ({ setData }) => {

  const handleFileChange = (event) => {
    console.log("file uplaod")
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Set to true if your CSV has headers
        skipEmptyLines: true,
        complete: (results) => {
            console.log(results.data)
          setData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV: ", error);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <h2>Parsed Data:</h2>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default CsvUploader;
