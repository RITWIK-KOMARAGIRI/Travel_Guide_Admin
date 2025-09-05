import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NearbyPlaces = () => {
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [form, setForm] = useState({
        place: "",
        tovisit: [{ name: "", budget: "", opening: "", closing: "", rules: "" }]
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchNearbyPlaces();
    }, []);

    const fetchNearbyPlaces = async () => {
        const res = await axios.get("https://travel-guide-admin.onrender.com/fetch/nearbyPlaces");
        setNearbyPlaces(res.data);
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleVisitChange = (index, field, value) => {
        const updated = [...form.tovisit];
        updated[index][field] = value;
        setForm({ ...form, tovisit: updated });
    };

    const addVisit = () => {
        setForm({ ...form, tovisit: [...form.tovisit, { name: "", budget: "", opening: "", closing: "", rules: "" }] });
    };

    const resetForm = () => {
        setForm({ place: "", tovisit: [{ name: "", budget: "", opening: "", closing: "", rules: "" }] });
        setEditingId(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                const res = await axios.put(`https://travel-guide-admin.onrender.com/update/nearbyPlace/${editingId}`, form);
                const updated = nearbyPlaces.map(p => p._id === editingId ? res.data : p);
                setNearbyPlaces(updated);
            } else {
                const res = await axios.post("https://travel-guide-admin.onrender.com/create/nearbyPlace", form);
                const found = nearbyPlaces.find(p => p.place === res.data.place);
                if (found) {
                    const updated = nearbyPlaces.map(p =>
                        p.place === res.data.place ? res.data : p
                    );
                    setNearbyPlaces(updated);
                } else {
                    setNearbyPlaces([...nearbyPlaces, res.data]);
                }
            }
            resetForm();
        } catch (err) {
            console.error("Submit error:", err);
        }
    };
    const handleDelete = async (id) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this place?");
            if (!confirm) return;

            await axios.delete(`http://localhost:5000/delete/nearbyPlace/${id}`);
            setNearbyPlaces(nearbyPlaces.filter(p => p._id !== id));
        } catch (err) {
            console.error("Error deleting place:", err);
        }
    };
    const handleDeleteVisit = async (id, index) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this visit?");
            if (!confirm) return;

            await axios.delete(`http://localhost:5000/delete/nearbyPlace/${id}/place/${index}`);
            const updated = nearbyPlaces.map(p => {
                if (p._id === id) {
                    p.tovisit.splice(index, 1);
                }
                return p;
            });
            setNearbyPlaces(updated);
        } catch (err) {
            console.error("Error deleting visit:", err);    
        }}

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
            <input
                className="border p-2 mb-3 w-full"
                placeholder="Place Name"
                value={form.place}
                onChange={(e) => handleChange("place", e.target.value)}
            />
            {form.tovisit.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 mb-3">
                    <input className="border p-2" placeholder="Name" value={item.name} onChange={(e) => handleVisitChange(index, "name", e.target.value)} />
                    <input className="border p-2" placeholder="Budget" value={item.budget} onChange={(e) => handleVisitChange(index, "budget", e.target.value)} />
                    <input className="border p-2" placeholder="Opening" value={item.opening} onChange={(e) => handleVisitChange(index, "opening", e.target.value)} />
                    <input className="border p-2" placeholder="Closing" value={item.closing} onChange={(e) => handleVisitChange(index, "closing", e.target.value)} />
                    <input className="border p-2 col-span-2" placeholder="Rules" value={item.rules} onChange={(e) => handleVisitChange(index, "rules", e.target.value)} />
                </div>
            ))}
            <button className="bg-gray-300 px-4 py-1 rounded mb-4" onClick={addVisit}>+ Add Another</button>
            <div className="flex gap-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                    {editingId ? "Update" : "Add"}
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={resetForm}>Reset</button>
            </div>

            <hr className="my-6" />
            <h3 className="text-xl font-semibold mb-2">Existing Nearby Places</h3>
            <div>
                {nearbyPlaces.map((item) => (
                    <div key={item._id} className="border p-4 mb-4 rounded shadow-sm bg-gray-50">
                        <h4 className="font-bold">{item.place}</h4>
                       <ul className="ml-4 mt-2 space-y-1">
    {item.tovisit.map((visit, idx) => (
        <li key={idx} className="flex justify-between items-center bg-white px-2 py-1 border rounded">
            <div>
                <strong>{visit.name}</strong> – ₹{visit.budget} – {visit.opening} to {visit.closing}
            </div>
            <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => handleDeleteVisit(item._id, idx)}
            >
                Delete
            </button>
        </li>
    ))}
</ul>

                        <div className="mt-2 space-x-2">
                            <button className="text-blue-600" onClick={() => {
                                setForm({ place: item.place, tovisit: [...item.tovisit] });
                                setEditingId(item._id);
                            }}>Edit</button>
                            <button className="text-red-600" onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NearbyPlaces;
