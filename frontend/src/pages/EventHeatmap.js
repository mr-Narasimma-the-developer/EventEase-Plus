import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import API from '../utils/api';
import 'leaflet/dist/leaflet.css';

const EventHeatmap = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default center (India)
  const defaultCenter = [20.5937, 78.9629];

  useEffect(() => {
    fetchEvents();
  }, []);

const fetchEvents = async () => {
  try {
    const { data } = await API.get('/events/public');
    
    // For demo: Generate coordinates based on location name
    const eventsWithCoords = data.map(event => {
      // Simple coordinate mapping for Indian cities
      const cityCoords = {
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'delhi': { lat: 28.6139, lng: 77.2090 },
        'bangalore': { lat: 12.9716, lng: 77.5946 },
        'chennai': { lat: 13.0827, lng: 80.2707 },
        'kolkata': { lat: 22.5726, lng: 88.3639 },
        'hyderabad': { lat: 17.3850, lng: 78.4867 },
        'pune': { lat: 18.5204, lng: 73.8567 },
        'ahmedabad': { lat: 23.0225, lng: 72.5714 }
      };

      const location = event.location.toLowerCase();
      const cityKey = Object.keys(cityCoords).find(city => location.includes(city));
      
      if (cityKey) {
        // Add slight random offset for multiple events in same city
        return {
          ...event,
          lat: cityCoords[cityKey].lat + (Math.random() - 0.5) * 0.1,
          lng: cityCoords[cityKey].lng + (Math.random() - 0.5) * 0.1
        };
      } else {
        // Default to India center with random offset
        return {
          ...event,
          lat: 20.5937 + (Math.random() - 0.5) * 10,
          lng: 78.9629 + (Math.random() - 0.5) * 10
        };
      }
    });

    setEvents(eventsWithCoords);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching events:', error);
    setLoading(false);
  }
};

  // const fetchEvents = async () => {
  //   try {
  //     const { data } = await API.get('/events/public');
      
  //     // Add mock coordinates for demo (in real app, use Google Geocoding API)
  //     const eventsWithCoords = data.map(event => ({
  //       ...event,
  //       lat: 28.6139 + (Math.random() - 0.5) * 10, // Random near Delhi
  //       lng: 77.2090 + (Math.random() - 0.5) * 10
  //     }));

  //     setEvents(eventsWithCoords);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //     setLoading(false);
  //   }
  // };

  // // Calculate event density by location
  const getLocationDensity = () => {
    const densityMap = {};
    events.forEach(event => {
      const key = event.location || 'Unknown';
      densityMap[key] = (densityMap[key] || 0) + 1;
    });
    return Object.entries(densityMap).sort((a, b) => b[1] - a[1]);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading heatmap...</div>;
  }

  const densityData = getLocationDensity();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">🗺️ Event Heatmap</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600">{events.length}</div>
            <div className="text-gray-600">Total Events</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{densityData.length}</div>
            <div className="text-gray-600">Locations</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {densityData[0]?.[0] || 'N/A'}
            </div>
            <div className="text-gray-600">Hottest Location</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {densityData[0]?.[1] || 0}
            </div>
            <div className="text-gray-600">Events in Hotspot</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
         <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
  <div className="h-[600px] w-full">
    <MapContainer 
      center={defaultCenter} 
      zoom={5} 
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {events.map(event => (
        <CircleMarker
          key={event._id}
          center={[event.lat, event.lng]}
          radius={10}
          fillColor="#4F46E5"
          fillOpacity={0.7}
          color="#ffffff"
          weight={2}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="text-sm text-gray-600">
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  </div>
</div>


          {/* Density Ranking */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">📊 Location Density Ranking</h2>
            <div className="space-y-3">
              {densityData.map(([location, count], index) => (
                <div key={location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-indigo-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{location}</div>
                      <div className="text-sm text-gray-600">{count} events</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(count / densityData[0][1]) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeatmap;