import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [form, setForm] = useState({ place: "", hotels: [{ name: "", rating: "", budget: "" }] });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get("https://travel-guide-admin.onrender.com/fetch/hotels");
                setHotels(res.data);
                console.log("Hotels fetched:", res.data);
            } catch (err) {
                console.error("Error fetching hotels", err);
            }
        };
        fetchHotels();
    }, []);

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleHotelChange = (index, field, value) => {
        const updatedHotels = [...form.hotels];
        updatedHotels[index][field] = value;
        setForm({ ...form, hotels: updatedHotels });
    };

    const handleAddHotel = () => {
        setForm({ ...form, hotels: [...form.hotels, { name: "", rating: "", budget: "" }] });
    };

    const handleEdit = (hotel) => {
        setForm({ place: hotel.place, hotels: [...hotel.hotels] });
        setEditingId(hotel._id);
    };

    const resetForm = () => {
        setForm({ place: "", hotels: [{ name: "", rating: "", budget: "" }] });
        setEditingId(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                const res = await axios.put(`https://travel-guide-admin.onrender.com/update/hotel/${editingId}`, form);
                const updated = hotels.map((h) => (h._id === editingId ? res.data : h));
                setHotels(updated);
            } else {
                const res = await axios.post("https://travel-guide-admin.onrender.com/create/hotel", form);
                setHotels(res.data);
            }
            resetForm();
        } catch (err) {
            console.error("Error submitting hotel", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this entire place?");
            if (!confirmDelete) return;

            const res = await axios.delete(`https://travel-guide-admin.onrender.com/delete/hotel/${id}`);
            setHotels(res.data);
        } catch (err) {
            console.error("Error deleting place", err);
        }
    };

    const handleDeleteSingleHotel = async (placeId, hotelIndex) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this individual hotel stay?");
            if (!confirmDelete) return;

            const res = await axios.delete(`https://travel-guide-admin.onrender.com/delete/single/hotel/${placeId}/${hotelIndex}`);
            setHotels(res.data);
        } catch (err) {
            console.error("Error deleting individual hotel:", err);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Hotel Management</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 border">
                <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Place" : "Add New Place"}</h2>

                <input
                    type="text"
                    placeholder="Place Name"
                    value={form.place}
                    onChange={(e) => handleInputChange("place", e.target.value)}
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {form.hotels.map((hotel, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Hotel Name"
                            value={hotel.name}
                            onChange={(e) => handleHotelChange(index, "name", e.target.value)}
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Rating"
                            value={hotel.rating}
                            onChange={(e) => handleHotelChange(index, "rating", e.target.value)}
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Budget"
                            value={hotel.budget}
                            onChange={(e) => handleHotelChange(index, "budget", e.target.value)}
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                ))}

                <button
                    onClick={handleAddHotel}
                    className="text-sm text-blue-600 hover:underline mb-4"
                >
                    + Add Another Hotel
                </button>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        {editingId ? "Update" : "Submit"}
                    </button>
                    <button
                        onClick={resetForm}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Hotels Display */}
            <div className="grid gap-6">
                {hotels.map((hotel, index) => (
                    <div key={index} className="bg-white border rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-blue-600">{hotel.place}</h3>
                            <div className="space-x-4">
                                <button
                                    onClick={() => handleEdit(hotel)}
                                    className="text-yellow-600 font-medium hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(hotel._id)}
                                    className="text-red-600 font-medium hover:underline"
                                >
                                    Delete Place
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {hotel.hotels.map((h, i) => (
                                <div key={i} className="p-4 border rounded bg-gray-50">
                                    <p><strong>{i + 1}. Name:</strong> {h.name}</p>
                                    <p><strong>Rating:</strong> {h.rating}</p>
                                    <p><strong>Budget:</strong> ₹{h.budget}</p>
                                    <button
                                        onClick={() => handleDeleteSingleHotel(hotel._id, i)}
                                        className="text-sm text-red-500 mt-2 hover:underline"
                                    >
                                        Delete Stay
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hotels;
