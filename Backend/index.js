const express = require("express")
const mongoose = require("mongoose")
const moment = require('moment');
const cors = require("cors")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');
const app = express()
const {Auth}=require("./schema/Auth")
const { Users } =require("./schema/User")
app.use(cors())
app.use(express.json());



main().catch(err=>console.log(err))
async function main(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/interns');
        console.log("databse Connected")
      } catch (error) {
        handleError(error);
      }
}



app.post("/login", async (req, res) => {
    const { username,designation } = req.body;
    const loginTime = new Date();
  
    try {
      // Create a new user entry with the login time
      await Users.create({ username, loginTime,designation });
      res.status(200).json({ message: "Login recorded successfully" });
    } catch (error) {
      console.error("Error recording login", error);
      res.status(500).json({ error: "Failed to record login" });
    }
  });
  
  app.post("/logout", async (req, res) => {
    const { _id, loginTime } = req.body;
    const logoutTime = new Date();

    const startingTimestamp = moment(loginTime);
    const endingTimestamp = moment(logoutTime);
    const hourDifference = endingTimestamp.diff(startingTimestamp, 'hours');
  
    try {
      // Find the user and update the logout time and hour difference
      const user = await Users.findOneAndUpdate(
        { _id },
        { logoutTime, hours: hourDifference }, // Store hour difference as a string
        { new: true }
      );
      res.status(200).json(user);
    } catch (error) {
      console.error("Error recording logout", error);
      res.status(500).json({ error: "Failed to record logout" });
    }
  });
  app.get("/getdata",async(req,res)=>{
    const users = await Users.find();
    res.status(200).json(users)
  })

  app.get("/user/:_id", async (req, res) => {
    try {
      const { _id } = req.params;
      const user = await Users.findOne({ _id }).exec();
  
      res.status(200).json(user);
    } catch (error) {
      console.log('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });


  app.post('/upload', upload.single('file'), (req, res) => {
    // Read the uploaded file
    const excelData = readExcel(req.file.path);
  
    // Insert data into MongoDB
    insertDataToMongoDB(excelData)
      .then(() => {
        // Send response
        res.send('File uploaded and data inserted into MongoDB successfully!');
      })
      .catch((error) => {
        // Send error response
        res.status(500).send('Error inserting data into MongoDB: ' + error.message);
      });
  });
  

  // Function to read Excel file
  function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return sheetData;
  }
  async function insertDataToMongoDB(data) {
    try {
      const client = await MongoClient.connect("mongodb://127.0.0.1:27017/interns");
      const db = client.db("interns");
      const collection = db.collection("users");
  
      const today = new Date(); // Get today's date
      today.setHours(0, 0, 0, 0); // Set the time to midnight (00:00:00)
  
      const formattedDate = today.toISOString().split('T')[0]; // Format date as "yyyy-mm-dd"
  
      const transformedData = data.map(item => {
        return {
          ...item,
          date: formattedDate
        };
      });
  
      await collection.insertMany(transformedData);
      client.close();
      console.log("Data inserted into MongoDB successfully!");
    } catch (error) {
      console.error("Error inserting data into MongoDB:", error);
      throw error;
    }
  }

  app.post("/register", async (req,res,next)=>{  
    const { email } = req.body;  
  
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
      const User=  await Auth.create(req.body)
      res.status(201).json({
          data:{
              User
          }
      })
  
      if(!User){
          res.status(404).json({
              error:"User not found"
          })
      }
  })

 app.post("/singin", async function(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required."
      });
    }
  
    const user = await Auth.findOne({ email }).select('+password');
  
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found."
      });
    }
  
   
  
    if (user.password!==password) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect password."
      });
    }
  
  
    res.status(200).json({
      data: {
        user
      }
    });
  })

 

app.listen(5000 ,()=>{
    console.log("Server Started")
})

