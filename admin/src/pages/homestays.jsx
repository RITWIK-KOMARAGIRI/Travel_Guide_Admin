import React, { useEffect, useState } from "react";
import axios from "axios";

const Homestays = () => {
    const [homestays, setHomestays] = useState([]);
    const [form, setForm] = useState({ place: "", stays: [{ name: "", rating: "", budget: "" }] });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchHomestays();
    }, []);

    const fetchHomestays = async () => {
        const res = await axios.get("http://localhost:5000/fetch/homestays");
        setHomestays(res.data);
    };

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleStayChange = (index, field, value) => {
        const updatedStays = [...form.stays];
        updatedStays[index][field] = value;
        setForm({ ...form, stays: updatedStays });
    };

    const handleAddStay = () => {
        setForm({ ...form, stays: [...form.stays, { name: "", rating: "", budget: "" }] });
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                const res = await axios.put(`http://localhost:5000/update/homestay/${editingId}`, form);
                const updated = homestays.map((h) => (h._id === editingId ? res.data : h));
                setHomestays(updated);
            } else {
                const res = await axios.post("http://localhost:5000/create/homestay", form);
                setHomestays(res.data);
            }
            resetForm();
        } catch (err) {
            console.error("Error submitting homestay", err);
        }
    };

    const handleEdit = (homestay) => {
        setForm({ place: homestay.place, stays: [...homestay.stays] });
        setEditingId(homestay._id);
    };

    const resetForm = () => {
        setForm({ place: "", stays: [{ name: "", rating: "", budget: "" }] });
        setEditingId(null);
    };
    const handleDelete = async (id) => {
    try {
        const confirm = window.confirm("Are you sure you want to delete this homestay?");
        if (!confirm) return;

        const res = await axios.delete(`http://localhost:5000/delete/homestay/${id}`);
        setHomestays(res.data);
    } catch (err) {
        console.error("Failed to delete homestay:", err);
    }
};

const handleDeleteStay = async (homestayId, stayIndex) => {
    const confirm = window.confirm("Are you sure you want to delete this stay?");
    if (!confirm) return;

    try {
        const res = await axios.delete(`http://localhost:5000/delete/homestay/${homestayId}/stay/${stayIndex}`);
        // Update the homestays list with new data
        setHomestays((prev) =>
            prev.map((h) => (h._id === res.data._id ? res.data : h))
        );
    } catch (error) {
        console.error("Error deleting stay:", error);
    }
};

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center">Homestays Manager</h1>

            {/* Form */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">{editingId ? "Edit Homestay" : "Add Homestay"}</h2>
                <input
                    type="text"
                    value={form.place}
                    onChange={(e) => handleInputChange("place", e.target.value)}
                    placeholder="Enter place"
                    className="w-full mb-3 p-2 border border-gray-300 rounded"
                />
                {form.stays.map((stay, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                        <input
                            type="text"
                            value={stay.name || ""}
                            onChange={(e) => handleStayChange(index, "name", e.target.value)}
                            placeholder="Stay Name"
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            value={stay.rating || ""}
                            onChange={(e) => handleStayChange(index, "rating", e.target.value)}
                            placeholder="Rating"
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            value={stay.budget || ""}
                            onChange={(e) => handleStayChange(index, "budget", e.target.value)}
                            placeholder="Budget"
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}
                <div className="flex gap-2">
                    <button
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                        onClick={handleAddStay}
                    >
                        + Add Stay
                    </button>
                    <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        {editingId ? "Update Homestay" : "Save Homestay"}
                    </button>
                    {editingId && (
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Available Homestays</h2>
                {homestays.length === 0 ? (
                    <p className="text-gray-500">No homestays found.</p>
                ) : (
                    homestays.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded shadow mb-4 border">
                           <div className="flex justify-between items-center">
    <h3 className="text-lg font-bold text-indigo-600">{item.place}</h3>
    <div className="flex gap-2">
        <button
            onClick={() => handleEdit(item)}
            className="text-sm bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
        >
            Edit
        </button>
        <button
            onClick={() => handleDelete(item._id)}
            className="text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
        >
            Delete
        </button>
    </div>
</div>

                         <ul className="pl-6 list-disc">
    {item.stays.map((stay, idx) => (
        <li key={idx} className="flex justify-between items-center gap-2 mb-1">
            <div>
                🏡 <span className="font-medium">{stay.name}</span> – ⭐ {stay.rating}, 💰 ₹{stay.budget}
            </div>
            <button
                onClick={() => handleDeleteStay(item._id, idx)}
                className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600"
            >
                Delete Stay
            </button>
        </li>
    ))}
</ul>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Homestays;
