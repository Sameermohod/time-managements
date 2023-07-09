import { Avatar, Progress, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Modal from 'react-modal';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import moment from 'moment';
const customStyles = {
  content: {
    width:"100vh",
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchInput, setSearchInput] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [find,setFind]=useState({})

    let subtitle;
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      subtitle.style.color = '#f00';
    }

    function closeModal() {
      setIsOpen(false);
    }
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("http://localhost:5000/getdata");
      const result = await res.json();
      setDataSource(result);
      
      console.log(result);
    };
    getData();
  }, []);

  useEffect(() => {
    const filteredData = dataSource.filter((product) => {
      const productDate = moment(product.loginTime).format('YYYY-MM-DD'); 
      const searchDate = moment(searchInput).format('YYYY-MM-DD'); 
      return productDate === searchDate;
    });
    setFilteredData(filteredData);
  }, [searchInput, dataSource]);

  // Function to group data by hour
  const groupDataByHour = () => {
    const groupedData = {};

    filteredData.forEach((item) => {
      const loginTime = new Date(item.loginTime);
      const hour = loginTime.getDay();

      if (!groupedData[hour]) {
        groupedData[hour] = [];
      }

      groupedData[hour].push(item);
    });

    return groupedData;
  };
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const find1 = {
    username: find.username,
    hours: parseFloat(find.hours),
  };

  const totalHours = 40;
 

  const data = [
    { name: 'Actual Hours', value: find1.hours },
    { name: 'Remaining Hours', value: totalHours - find1.hours },
  ];

  const COLORS = ['#8884d8']; // Color options for the pie slice
  



  // Generate separate tables for each hour
  const generateTables = () => {
    const groupedData = groupDataByHour();

    return Object.keys(groupedData).map((hour) => {
      const data = groupedData[hour];

      return (
        <Table
          key={hour}
          style={{ width: "89vw" }}
          loading={loading}
          columns={[
            {
              title: "Username",
              dataIndex: "Username",
              render: (value) => <span>{value}</span>,
            },
            {
              title: "LoginTime",
              dataIndex: "LoginTime",
            },
            {
              title: "LogoutTime",
              dataIndex: "LogoutTime",
            },
            {
              title: "Designation",
              dataIndex: "Designation",
            },
            {
              title: "hours",
              dataIndex: "hours",
            },
            {
              title: "date",
              dataIndex: "date",
            },
            {
              title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <span  onClick={
    async()=>{
      try {
        setIsOpen(true)
        const response = await fetch(`http://localhost:5000/user/${record._id}`,{
          method:"GET"
        });
        const data1 = await response.json();
        setFind(data1);
        console.log(find)
        
      } catch (error) {
        console.log(error);
      }
    }
   }>time report</span>
      </Space>
    ),
            }
            
          ]}
          dataSource={data}
          pagination={{
            pageSize: 5,
          }}
        />
      );
    });
  };

  return (
    <div>

    <Space size={20} direction="vertical">

<input
        type="date"
        value={searchInput}
        onChange={handleSearchInputChange}
        style={{ width: "50vh", padding: "10px" }}
        placeholder="Search by title"
      />
      <Typography.Title level={4}>Student Details</Typography.Title>
  

      {generateTables()}
    </Space>

    <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

<div>
      <h1>Weekly Report</h1>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
      
      </Modal>
    </div>
  );
}

export default Inventory;