const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/file/student-list", require("./routes/api/file/studentList"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/institute", require("./routes/api/instituteDegree"));
app.use("/api/subject", require("./routes/api/subject"));
app.use("/api/pedagogy", require("./routes/api/pedagogy"));
app.use("/api/academic-year", require("./routes/api/academicYear"));
app.use("/api/exam-schedule", require("./routes/api/examSchedule"));
app.use("/api/not-eligible", require("./routes/api/notEligible"));
app.use("/api/resources", require("./routes/api/resources"));
app.use("/api/seating-arrangement", require("./routes/api/seatingArrangement"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/adminAuth", require("./routes/api/adminAuth"));

// Connect to environment port or 5500
const PORT = process.env.PORT || 5500;

// Start listening on specified port number
app.listen(PORT, () => {}); //
app.get("/", (req, res) => res.send("Api Stated.."));
