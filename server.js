const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const actionRoutes = require("./routes/actionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { sendNoticeEmail } = require("./services/emailService");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });

// Routes
app.use("/auth", authRoutes);
app.use("/notices", noticeRoutes);
app.use("/actions", actionRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("Notice2Action AI Backend is Running");
});

const PORT = process.env.PORT || 5000;

app.get("/test-email", async (req, res) => {

    try {

        await sendNoticeEmail(
            process.env.EMAIL_USER,
            "Meghana",
            "Test Notice",
            "TEST123",
            `
                <p><strong>Eligibility:</strong> CSE students</p>
                <p><strong>Deadline:</strong> 25 September 2026</p>
                <p><strong>Action:</strong> Register before the deadline.</p>
            `
        );

        res.json({
            message: "Test email sent successfully"
        });

    } catch (error) {

        console.log("Email Test Error:", error);

        res.status(500).json({
            message: "Failed to send test email",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});