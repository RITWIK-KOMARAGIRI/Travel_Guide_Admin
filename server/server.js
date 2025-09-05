const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const {
    loginModel,
    placeModel,
    tovisitModel,
    budgetModel,
    topratedModel,
    hotelsModel,
    homestaysModel: Homestay,
    hospitalModel,
    profileModel,
    AdminloginModel
} = require('./models/tables.jsx');

mongoose.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ Could not connect to MongoDB:", err));

// Fetch main places
app.get("/fetch/mainplace", async (req, res) => {
    try {
        const mainPlaces = await placeModel.find({});
        res.json(mainPlaces);
    } catch (err) {
        console.error("Error fetching main places:", err);
        res.status(500).send("Server error");
    }
});

// Create profile
app.post('/create/profile', async (req, res) => {
    try {
        const newProfile = new profileModel(req.body);
        await newProfile.save();
        res.status(201).send('Profile created successfully');
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).send('Error creating profile');
    }
});

// Update main place
app.put("/update/mainplace/:id", async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;

        const updated = await placeModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Place not found" });
        }

        console.log("✅ Updated:", updated);
        res.json(updated);
    } catch (err) {
        console.error("❌ Update failed:", err);
        res.status(500).json({ error: "Server error during update" });
    }
});
// Create main place
app.post("/create/mainplace", async (req, res) => {
    try {
        const exists = await placeModel.findOne({ placename: new RegExp(`^${req.body.placename.trim()}$`, 'i') });
        if (exists) return res.status(409).json({ message: "Place already exists" });

        const newPlace = new placeModel(req.body);
        await newPlace.save();
        res.status(201).json(newPlace);
    } catch (error) {
        console.error("Error creating place:", error);
        res.status(500).send("Server error");
    }
});
app.delete('/delete/mainplace/:id', async (req, res) => {
    try {
        await placeModel.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting place");
    }
});


// Fetch homestays
  app.get("/fetch/homestays", async (req, res) => {
    try {
        const data = await Homestay.find({});
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch homestays" });
    }
});

// Add or merge homestay
app.post("/create/homestay", async (req, res) => {
    const { place, stays } = req.body;

    if (!place || !stays || !Array.isArray(stays)) {
        return res.status(400).json({ error: "Invalid homestay data." });
    }

    try {
        const existing = await Homestay.findOne({ place: new RegExp(`^${place.trim()}$`, "i") });

        if (existing) {
            existing.stays.push(...stays);
            await existing.save();
            return res.status(200).json(await Homestay.find({}));
        } else {
            const newStay = new Homestay({ place: place.trim(), stays });
            await newStay.save();
            return res.status(201).json(await Homestay.find({}));
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Update homestay place and stays
app.put("/update/homestay/:id", async (req, res) => {
    try {
        const updated = await Homestay.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update homestay" });
    }
});
// Delete a homestay by ID
app.delete("/delete/homestay/:id", async (req, res) => {
    try {
        await Homestay.findByIdAndDelete(req.params.id);
        const updatedList = await Homestay.find({});
        res.json(updatedList);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete homestay" });
    }
});
app.delete("/delete/homestay/:homestayId/stay/:index", async (req, res) => {
    const { homestayId, index } = req.params;

    try {
        const homestay = await Homestay.findById(homestayId);
        if (!homestay) return res.status(404).json({ error: "Homestay not found" });

        if (index < 0 || index >= homestay.stays.length)
            return res.status(400).json({ error: "Invalid stay index" });

        homestay.stays.splice(index, 1); 
        await homestay.save();

        res.json(homestay);
    } catch (err) {
        console.error("Error deleting stay:", err);
        res.status(500).json({ error: "Server error during stay deletion" });
    }
});
app.get("/fetch/hotels", async (req, res) => {
    try{
        const hotels = await hotelsModel.find({});
        res.json(hotels);
    }
    catch(err){
        console.error("Error fetching hotels:", err);
        res.status(500).json({ error: "Failed to fetch hotels" });
    }
});
app.put("/update/hotel/:id", async (req, res) => {
    try {
        const updatedHotel = await hotelsModel.findByIdAndUpdate(req.params.id, req.body,{new : true});
        if(!updatedHotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        res.json(updatedHotel);
    } catch (err) {
        console.error("Error updating hotel:", err);
        res.status(500).json({ error: "Failed to update hotel" });
    }
});
app.post("/create/hotel", async (req, res) => {
    const { place, hotels } = req.body;

    try {
        const existing = await hotelsModel.findOne({ place });

        if (existing) {
            // Append new stays to existing document
            existing.hotels.push(...hotels);
            await existing.save();
            const all = await hotelsModel.find();
            return res.json(all);
        } else {
            // Create new document
            const newHotel = new hotelsModel({ place, hotels });
            await newHotel.save();
            const all = await hotelsModel.find();
            return res.json(all);
        }
    } catch (err) {
        console.error("Error creating hotel:", err);
        res.status(500).json({ error: "Server error while creating hotel" });
    }
});

app.delete("/delete/hotel/:id", async (req, res) => {
    try {
        const deletedHotel = await hotelsModel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        const hotels = await hotelsModel.find({});
        res.json(hotels);
    } catch (err) {
        console.error("Error deleting hotel:", err);
        res.status(500).json({ error: "Failed to delete hotel" });
    }
});
app.delete("/delete/single/hotel/:placeId/:hotelIndex", async (req, res) => {
    const { placeId, hotelIndex } = req.params;
    const index = parseInt(hotelIndex);

    try {
        const hotel = await hotelsModel.findById(placeId);
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        if (index < 0 || index >= hotel.hotels.length)
            return res.status(400).json({ error: "Invalid hotel index" });

        hotel.hotels.splice(index, 1); 
        await hotel.save();

        res.json(await hotelsModel.find()); // Optional: return full list for frontend
    } catch (err) {
        console.error("Error deleting hotel:", err);
        res.status(500).json({ error: "Server error during hotel deletion" });
    }
});
app.post("/create/nearbyPlace", async (req, res) => {
    const { place, tovisit } = req.body;
    try {
        let existing = await tovisitModel.findOne({ place });

        if (existing) {
            existing.tovisit.push(...tovisit); // add all new entries to existing
            await existing.save();
            return res.json(existing);
        } else {
            const newPlace = new tovisitModel({ place, tovisit });
            await newPlace.save();
            return res.json(newPlace);
        }
    } catch (err) {
        console.error("Error creating nearby place:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/fetch/nearbyPlaces", async (req, res) => {
    const data = await tovisitModel.find();
    res.json(data);
});

app.put("/update/nearbyPlace/:id", async (req, res) => {
    const updated = await tovisitModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete("/delete/nearbyPlace/:id", async (req, res) => {
    await tovisitModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.delete("/delete/nearbyPlace/:id/place/:index", async (req, res) => {
    const { id, index } = req.params;
    try {
        const doc = await tovisitModel.findById(id);
        doc.tovisit.splice(index, 1);
        await doc.save();
        res.json(doc);
    } catch (err) {
        console.error("Error deleting place:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await AdminloginModel.findOne({ email, password });

  if (user) {
    res.status(200).json({ message: "Login successful", user });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});


app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
});
