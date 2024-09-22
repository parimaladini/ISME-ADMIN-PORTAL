import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import CsvUploader from "./pages/Upload";
import AttendanceTable from './components/AttendanceTable';

function App() {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    console.log(csvData);
    console.log(!!csvData);
  }, [])

  return (
    <>
      <AttendanceTable />
    </>
  )
}

export default App
