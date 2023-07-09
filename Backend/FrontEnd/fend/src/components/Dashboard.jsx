import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5; 
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:5000/getdata");
        const result = await res.json();
        setDataSource(result);
  
        // Get the length of data with LoginTime
        const dataWithLoginTime = result.filter(item => item.LoginTime);
        const lengthOfDataWithLoginTime = dataWithLoginTime.length;
        console.log("Length of data with LoginTime:", lengthOfDataWithLoginTime);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  
    getData();
  }, []);


  // Pagination
  

  const breakTime = 1; // Break time in hours
  const overallHours = 8; // Overall hours

  const chartData = dataSource.map((dataPoint) => {
    const fullName = dataPoint.Username;
    const firstName = fullName.split(" ")[0]; // Extract the first name
    const overalldata=dataPoint.LoginTime;

    const workingHours = parseFloat(dataPoint.hours); // Convert to numeric value
    const adjustedHours = isNaN(workingHours) ? 0 : workingHours - breakTime; // Subtract break time from working hours or set to 0 if NaN
    const remainingHours = overallHours - breakTime; // Calculate remaining hours

    return {
      username: firstName,
      workingHours: adjustedHours,
      breakTime: breakTime,
      remainingHours: remainingHours,
      overalldata:overalldata
    };
  });

  const totalItems = chartData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = chartData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <BarChart width={600} height={400} data={paginatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="username" />
        <YAxis />
        <Tooltip />
        <Legend />
        
        <Bar dataKey="breakTime" stackId="stack" fill="#ff0000" barSize={40} />
        <Bar dataKey="workingHours" stackId="stack" fill="black" barSize={20} label={{ position: 'top' }} />



      </BarChart>

        <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
      />
      {/* Pagination Controls */}
   

      <h1>{dataSource.length}</h1>
    </div>
  );
};

export default Dashboard;
