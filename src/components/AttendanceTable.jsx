import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import Papa from 'papaparse';
import './AttendanceTable.scss';
import { app } from '../utils/fire'; // Ensure you're importing the app

const AttendanceTable = () => {
    const [data, setData] = useState([]);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isTableVisible, setIsTableVisible] = useState(false); // For toggling the table
    const [attendancePercentage, setAttendancePercentage] = useState(0); // For attendance percentage
    const database = getDatabase(app);

    // Handle CSV file upload
    const handleCSVUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    const parsedData = results.data;
                    if (validateCSVData(parsedData)) {
                        const formattedData = formatData(parsedData);
                        setData(formattedData);
                        setIsUploaded(true);
                        calculateAttendancePercentage(formattedData); // Calculate percentage on CSV upload
                    } else {
                        alert('Invalid CSV format. Please ensure it matches the required format.');
                    }
                },
                header: true,
                skipEmptyLines: true,
            });
        }
    };

    // Validate the uploaded CSV format
    const validateCSVData = (data) => {
        const headers = data[0];
        const requiredHeaders = ["student_name", "register_no", "2023-09-01", "2023-09-02", "2023-09-03", "2023-09-04", "2023-09-05", "2023-09-06", "2023-09-07", "2023-09-08", "2023-09-09", "2023-09-10"];
        return requiredHeaders.every(header => header in headers);
    };

    // Format the data after CSV upload
    const formatData = (data) => {
        return data.map(student => ({
            student_name: student.student_name,
            register_no: student.register_no,
            "2023-09-01": student["2023-09-01"],
            "2023-09-02": student["2023-09-02"],
            "2023-09-03": student["2023-09-03"],
            "2023-09-04": student["2023-09-04"],
            "2023-09-05": student["2023-09-05"],
            "2023-09-06": student["2023-09-06"],
            "2023-09-07": student["2023-09-07"],
            "2023-09-08": student["2023-09-08"],
            "2023-09-09": student["2023-09-09"],
            "2023-09-10": student["2023-09-10"],
        }));
    };

    // Handle attendance status change
    const handleChange = (student_name, register_no, date, newStatus) => {
        console.log(`Student: ${student_name}, Register No: ${register_no}, Date: ${date}, Status: ${newStatus}`);

        const updatedData = data.map(student => {
            if (student.register_no === register_no) {
                return { ...student, [date]: newStatus };
            }
            return student;
        });

        setData(updatedData);
        calculateAttendancePercentage(updatedData); // Recalculate attendance percentage on change
    };

    // Save data to Firebase
    const handleSave = async () => {
        try {
            const attendanceRef = ref(database, '/sir/slot/section/attendance');
            const attendanceData = {};

            data.forEach(student => {
                const { student_name, register_no, ...attendance } = student;
                attendanceData[register_no] = {
                    name: student_name,
                    register_no,
                    ...attendance,
                };
            });

            await set(attendanceRef, attendanceData);
            alert('Attendance data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    // Fetch data from Firebase
    const handleFetchData = async () => {
        try {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, '/sir/slot/section/attendance'));
            if (snapshot.exists()) {
                const fetchedData = [];
                const dataFromDB = snapshot.val();

                Object.keys(dataFromDB).forEach(registerNo => {
                    const student = dataFromDB[registerNo];
                    fetchedData.push({
                        student_name: student.name,
                        register_no: student.register_no,
                        ...student,
                    });
                });

                setData(fetchedData);
                setIsUploaded(true);
                calculateAttendancePercentage(fetchedData); // Calculate percentage on fetch
            } else {
                alert("No data found in the database.");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again.');
        }
    };

    // Toggle table visibility
    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
    };

    // Calculate attendance percentage
    const calculateAttendancePercentage = (data) => {
        let totalClasses = 0;
        let totalPresent = 0;

        data.forEach(student => {
            Object.keys(student).forEach(key => {
                if (key.startsWith('2023')) {
                    totalClasses++;
                    if (student[key] === 'P') {
                        totalPresent++;
                    }
                }
            });
        });

        const percentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0;
        setAttendancePercentage(percentage);
    };

    return (
        <div className="attendanceTable">
            {!isUploaded ? (
                <div className="fileUploadSection">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="csvUploader"
                    />
                    <button onClick={handleFetchData} className="fetchButton">Fetch from Database</button>
                </div>
            ) : (
                <>
                <h2>Welcome Mr.Rajasekar</h2>
                <h4>Attendance</h4>
                    <div className="courseSummary">
                        <button className="toggleButton" onClick={toggleTableVisibility}>
                            {isTableVisible ? '-' : '+'}
                        </button>
                        <span>Course Name - 212CSE1022 - Slot 13 - Section 19 - Attendance Percentage: {attendancePercentage}%</span>
                    </div>
                    {isTableVisible && (
                        <>
                            <button onClick={handleSave} className="saveButton">Save Attendance</button>
                            <table>
                                <thead>
                                    <tr>
                                        <th className="fixedWidth">Student</th>
                                        <th className="scrollableHeader" colSpan="10">Attendance</th>
                                    </tr>
                                    <tr>
                                        <th className="fixedWidth">Name (Register No)</th>
                                        {Object.keys(data[0]).filter(key => key.startsWith("2023")).map((date, index) => (
                                            <th key={index}>{date}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((student, index) => (
                                        <tr key={index}>
                                            <td className="fixedWidth">{`${student.student_name} (${student.register_no})`}</td>
                                            {Object.keys(student).filter(key => key.startsWith("2023")).map((date, i) => (
                                                <td key={i}>
                                                    <Dropdown
                                                        status={student[date]}
                                                        onChange={(newStatus) => handleChange(student.student_name, student.register_no, date, newStatus)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

// Dropdown component for status
const Dropdown = ({ status, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(status);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelect = (value) => {
        setSelected(value);
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className="customDropdown" onClick={toggleDropdown}>
            <div className="selected">{selected}</div>
            {isOpen && (
                <div className="options">
                    <div className="option" onClick={() => handleSelect('P')}>Present</div>
                    <div className="option" onClick={() => handleSelect('A')}>Absent</div>
                </div>
            )}
        </div>
    );
};

export default AttendanceTable;
