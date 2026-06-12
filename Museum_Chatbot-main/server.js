const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname)); // Serve files directly from the root directory

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/museumBOOK", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

// Booking schema
const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    eventName: String,
    tickets: Number,
    date: String,
    time: String,
    paymentMethod: String, // Add payment method field
    paymentStatus: { type: String, default: "Pending" } // Add payment status
});

const Booking = mongoose.model("Booking", bookingSchema);

// Event ticket limits
const ticketLimits = {
    "Ancient Sculptures Exhibition": 200,
    "Historic Paintings Showcase": 200,
    "Virtual Reality Museum Tour": 500,
    "Guided Museum Walkthrough": 500,
    "Photography Workshop": 200,
    "Interactive Art Display": 200
};

// Store booking in memory temporarily before payment
let temporaryBooking = {};

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Handle form submissions for bookings
app.post("/submitBooking", (req, res) => {
    temporaryBooking = req.body; // Temporarily store booking data
    res.redirect("/payment");    // Redirect to payment page
});

// Serve payment page
app.get("/payment", (req, res) => {
    if (Object.keys(temporaryBooking).length === 0) {
        return res.redirect("/"); // Redirect to home if no booking data
    }
    res.sendFile(path.join(__dirname, "payment.html"));
});

// Serve UPI payment page
app.get("/upi", (req, res) => {
    res.sendFile(path.join(__dirname, "upi.html"));
});

// Serve Card payment page
app.get("/card", (req, res) => {
    res.sendFile(path.join(__dirname, "card.html"));
});

// Handle payment completion
app.post("/completePayment", async (req, res) => {
    try {
        const { eventName, tickets } = temporaryBooking;
        const paymentMethod = req.body.paymentMethod;

        // Check ticket availability
        const totalTicketsSold = await Booking.aggregate([
            { $match: { eventName } },
            { $group: { _id: null, totalTickets: { $sum: "$tickets" } } }
        ]);

        const ticketsSold = totalTicketsSold.length > 0 ? totalTicketsSold[0].totalTickets : 0;
        const remainingTickets = ticketLimits[eventName] - ticketsSold;

        if (remainingTickets < tickets) {
            return res.status(400).send(`Only ${remainingTickets} tickets are available for ${eventName}.`);
        }

        // Save booking with payment method and status
        const newBooking = new Booking({
            ...temporaryBooking,
            paymentMethod,
            paymentStatus: "Completed"
        });
        await newBooking.save();

        temporaryBooking = {}; // Clear temporary booking after saving
        res.redirect("/confirmation"); // Redirect to confirmation page
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).send("An error occurred while saving your booking. Please try again.");
    }
});

// Serve confirmation page
app.get("/confirmation", (req, res) => {
    res.sendFile(path.join(__dirname, "confirmation.html"));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
