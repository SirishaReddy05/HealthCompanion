const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/sleep"; // Change if needed
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
      console.error("❌ MongoDB Connection Error:", err);
      process.exit(1);
  });

// ✅ Sleep Schema & Model
const sleepSchema = new mongoose.Schema({
    date: { type: String, unique: true },
    sleepHours: Number
});
const Sleep = mongoose.model("Sleep", sleepSchema);

// ✅ API to Save Sleep Data
app.post("/api/sleep", async (req, res) => {
    try {
        const { date, sleepHours } = req.body;
        let existingRecord = await Sleep.findOne({ date });

        if (existingRecord) {
            existingRecord.sleepHours = sleepHours;
            await existingRecord.save();
        } else {
            const newSleep = new Sleep({ date, sleepHours });
            await newSleep.save();
        }

        res.json({ message: "✅ Sleep data saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error saving sleep data" });
    }
});

// ✅ API to Get Weekly Sleep Data (Ensure Full Week Data)
app.get("/api/sleep", async (req, res) => {
    try {
        let today = new Date();
        let pastWeek = new Date();
        pastWeek.setDate(today.getDate() - 6);

        let sleepData = await Sleep.find({
            date: { $gte: pastWeek.toISOString().split("T")[0] }
        }).sort({ date: 1 });

        // ✅ Fill missing days with 0 hours
        let weeklySleep = {};
        for (let i = 0; i < 7; i++) {
            let day = new Date(pastWeek);
            day.setDate(day.getDate() + i);
            let dateStr = day.toISOString().split("T")[0];

            let record = sleepData.find(d => d.date === dateStr);
            weeklySleep[dateStr] = record ? record.sleepHours : 0;
        }

        let response = Object.keys(weeklySleep).map(date => ({
            date,
            sleepHours: weeklySleep[date]
        }));

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "❌ Error fetching sleep data" });
    }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
