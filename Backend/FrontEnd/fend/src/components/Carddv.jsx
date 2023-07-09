import { Card, CardBody, Typography } from '@material-tailwind/react'
import { useEffect, useState } from 'react';


import { FaUsers } from "react-icons/fa";

const Carddv = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataSource1, setDataSource1] = useState(null);



    useEffect(() => {
        const getData = async () => {
          try {
            const res = await fetch("http://localhost:5000/getdata");
            const result = await res.json();
            setDataSource(result);
      
            // Get the length of data with LoginTime
            const dataWithLoginTime = result.filter(item => item.LoginTime);
            const lengthOfDataWithLoginTime = dataWithLoginTime.length;
            setDataSource1(lengthOfDataWithLoginTime)
            console.log("Length of data with LoginTime:", lengthOfDataWithLoginTime);
          } catch (error) {
            console.log('Error fetching data:', error);
          }
        };
      
        getData();
      }, []);
  return (
    <div >
      <Card className="mt-6 w-96 ">
      <CardBody>
        <Typography variant="h4" color="blue-gray" className="mb-2 ">
         Todays <span  className='text-md text-black-50'> | Studnts</span>
        </Typography>
        <Typography className="flex  gap-3">
          <div className='text-6xl'>< FaUsers  /></div>
          <div>
            <h2 className='text-4xl text-blue-900'>{dataSource.length}</h2>
            <h2 className='text-[green]'>present<span className='text-black-50'>increase</span> </h2>
          </div>
        </Typography>
        
      </CardBody>
      
    </Card>
      
    </div>
  )
}

export default Carddv