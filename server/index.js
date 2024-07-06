const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// connect database
database.connect();

// middleware https://studynotion-frontend-rosy.vercel.app
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "https://studynotion-frontend-rosy.vercel.app",
        credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// connect clodinary
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/contact", contactUsRoute);

// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is running......",
    });
})

// instantiate your server
app.listen(PORT, () => {
    console.log(`app is running at port ${PORT}`);
});