import { Avatar, Progress, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getInventory } from "../../API";
import { SearchOutlined } from "@ant-design/icons";
import SideMenu from "../../Components/SideMenu";


function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getInventory().then((res) => {
      setDataSource(res.products);
      setLoading(false);
    });
  }, []);

  return (
    <div>
    <Space size={20} direction="vertical">


      <Typography.Title level={4} >Student Details</Typography.Title>
      <span> <input type="text" placeholder="     Search" style={{width:"50vh", padding:'10px'}}   />
       {/* <SearchOutlined  /> */}
       </span>

           <Table style={{width:"89vw"}}
        loading={loading}
        columns={[
          {
            title: "Profile",
            dataIndex: "Profile",
            render: (link) => {
              return <Avatar src={link} />;
            },
          },
          {
            title: "Name",
            dataIndex: "Name",
          },
          {
            title: "Email",
            dataIndex: "Email",
            render: (value) => <span>${value}</span>,
          },
          {
            title: "Mobile no.",
            dataIndex: "",
            render: (rating) => {
              // return <Rate value={rating} allowHalf />;
            },
          },

          {
            title: "Result",
            dataIndex: "result",
          },
        ]}
        // dataSource={dataSource}
        // pagination={{
        //   pageSize: 5,
        // }}
      ></Table>
    </Space>
    </div>
  );
}
export default Inventory;
