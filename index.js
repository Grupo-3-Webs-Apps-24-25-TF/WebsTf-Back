const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

console.log("Webs backend api started");

connection(process.env.MONGO_URI);

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

let cloudinary = require('cloudinary');
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UserRoutes = require("./routes/UserRoutes");
app.use("/api/users", UserRoutes);
const EventRoutes = require("./routes/EventRoutes");
app.use("/api/events", EventRoutes);

app.get("/test-route", (_req, res) => {
    return res.status(200).json({
        "version": "1.1.0"
    });
});

app.listen(port, () => {
    console.log("Node server running in port:", port); 
});