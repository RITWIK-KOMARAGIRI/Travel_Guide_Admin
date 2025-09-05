import { BrowserRouter ,HashRouter, Route,Routes } from "react-router-dom";
import MainPlace from './pages/mainPlace.jsx';
import Homestays from "./pages/homestays.jsx";
import Hotels from "./pages/hotels.jsx";
import NearbyPlaces from "./pages/nearbyPlaces.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
const  App= () =>{
  
  return(
  <HashRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/mainplaces" element={
      <ProtectedRoute>< MainPlace />
      </ProtectedRoute>} />
    <Route path="/homestays" element={< Homestays />} />
    <Route path="/hotels" element={< Hotels />} />
    <Route path="/nearbyPlaces" element={< NearbyPlaces />} />
  </Routes>
  </HashRouter>
  )
}
export default App;