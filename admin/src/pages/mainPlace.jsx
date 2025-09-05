import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainPlace = () => {
    const [mainPlaces, setMainPlaces] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedPlace, setEditedPlace] = useState({
        placename: '',
        month: '',
        about: '',
        minbudget: '',
        official: ''
    });

    const navigate = useNavigate();
    useEffect(() => {
  const user = localStorage.getItem("user");
  if (!user) {
    navigate('/');
  }

  const blockBack = () => {
    window.history.pushState(null, null, window.location.href);
  };

  blockBack();
  window.addEventListener('popstate', blockBack);

  return () => {
    window.removeEventListener('popstate', blockBack);
  };
}, [navigate]);

    useEffect(() => {
        const fetchMainPlace = async () => {
            try {
                const res = await axios.get("https://travel-guide-admin.onrender.com/fetch/mainplace");
                setMainPlaces(res.data);
            } catch (err) {
                console.error("Error fetching main places:", err);
            }
        };

        fetchMainPlace();
    }, []);

    const handleEditClick = (index, place) => {
        setEditingIndex(index);
        setEditedPlace({ ...place });
    };

    const handleFieldChange = (field, value) => {
        setEditedPlace(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveClick = async (id) => {
        try {
            await axios.put(`https://travel-guide-admin.onrender.com/update/mainplace/${id}`, editedPlace);
            const updatedPlaces = [...mainPlaces];
            updatedPlaces[editingIndex] = editedPlace;
            setMainPlaces(updatedPlaces);
            setEditingIndex(null);
            setEditedPlace({
                placename: '',
                month: '',
                about: '',
                minbudget: '',
                official: ''
            });
        } catch (error) {
            console.error("Error updating place:", error);
        }
    };

    const handleAdd = async () => {
        const isDuplicate = mainPlaces.some(
            p => p.placename.trim().toLowerCase() === editedPlace.placename.trim().toLowerCase()
        );

        if (isDuplicate) {
            alert("❌ Place already exists!");
            return;
        }

        try {
            const res = await axios.post("https://travel-guide-admin.onrender.com/create/mainplace", editedPlace);
            setMainPlaces([...mainPlaces, res.data]);
            setEditedPlace({
                placename: '',
                month: '',
                about: '',
                minbudget: '',
                official: ''
            });
        } catch (err) {
            console.error("Error adding place:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this place?")) {
            try {
                await axios.delete(`https://travel-guide-admin.onrender.com/delete/mainplace/${id}`);
                const updatedPlaces = mainPlaces.filter(place => place._id !== id);
                setMainPlaces(updatedPlaces);
            } catch (error) {
                console.error("Error deleting place:", error);
            }
        }
    };

    const handleHomeStays = () => navigate('/homestays');
    const handleHotels = () => navigate('/hotels');
    const handleNearbyPlaces = () => navigate('/nearbyPlaces');
    const handleLogout = () => {
  localStorage.removeItem("user");
  navigate('/');
};


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 font-sans">
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">📍 Main Places</h1>
                    <div className="flex gap-3">
                        <button onClick={handleHomeStays} className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition">
                            🏡 Homestays
                        </button>
                        <button onClick={handleHotels} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                            🏨 Hotels
                        </button>
                        <button onClick={handleNearbyPlaces} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
                            📌 Nearby Places
                        </button>
                        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* Add Form */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-blue-200">
                    <h2 className="text-xl font-semibold text-blue-700 mb-4">➕ Add New Place</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={editedPlace.placename} onChange={(e) => handleFieldChange("placename", e.target.value)} className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Place Name" />
                        <input type="text" value={editedPlace.month} onChange={(e) => handleFieldChange("month", e.target.value)} className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Month" />
                        <textarea value={editedPlace.about} onChange={(e) => handleFieldChange("about", e.target.value)} className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" placeholder="About" />
                        <input type="number" value={editedPlace.minbudget} onChange={(e) => handleFieldChange("minbudget", e.target.value)} className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Min Budget" />
                        <input type="text" value={editedPlace.official} onChange={(e) => handleFieldChange("official", e.target.value)} className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Official Site" />
                    </div>
                    <button onClick={handleAdd} className="mt-6 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">
                        ➕ Add Place
                    </button>
                </div>

                {/* Place Cards */}
                {mainPlaces.length > 0 ? (
                    mainPlaces.map((place, index) => (
                        <div key={place._id} className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200 hover:shadow-xl transition">
                            {editingIndex === index ? (
                                <div className="space-y-3">
                                    <input type="text" value={editedPlace.placename} onChange={(e) => handleFieldChange("placename", e.target.value)} className="w-full p-3 border rounded shadow-sm" placeholder="Place Name" />
                                    <input type="text" value={editedPlace.month} onChange={(e) => handleFieldChange("month", e.target.value)} className="w-full p-3 border rounded shadow-sm" placeholder="Month" />
                                    <textarea value={editedPlace.about} onChange={(e) => handleFieldChange("about", e.target.value)} className="w-full p-3 border rounded shadow-sm" placeholder="About" />
                                    <input type="number" value={editedPlace.minbudget} onChange={(e) => handleFieldChange("minbudget", e.target.value)} className="w-full p-3 border rounded shadow-sm" placeholder="Min Budget" />
                                    <input type="text" value={editedPlace.official} onChange={(e) => handleFieldChange("official", e.target.value)} className="w-full p-3 border rounded shadow-sm" placeholder="Official Site" />
                                    <button onClick={() => handleSaveClick(place._id)} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                                        💾 Save
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p><strong>📍 Place:</strong> {place.placename}</p>
                                    <p><strong>🗓️ Month:</strong> {place.month}</p>
                                    <p><strong>📝 About:</strong> {place.about}</p>
                                    <p><strong>💸 Budget:</strong> ₹{place.minbudget}</p>
                                    <p><strong>🔗 Official:</strong> <a href={place.official} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{place.official}</a></p>
                                    <div className="pt-4 flex gap-3">
                                        <button onClick={() => handleEditClick(index, place)} className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition">
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => handleDelete(place._id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg">🔄 Loading main places...</p>
                )}
            </div>
        </div>
    );
};

export default MainPlace;
