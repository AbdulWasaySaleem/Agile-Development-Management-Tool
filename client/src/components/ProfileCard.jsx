import React from 'react';
import Barcode from 'react-barcode'; // Assuming you have this library installed for barcode rendering

const ProfileCard = ({ profile, onClose }) => {
  if (!profile) return null;

  // Extract the last 6 digits of the ID
  const displayId = profile.id ? profile.id.slice(-6) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Company Name</h1>
          <div className="border-4 border-gray-600 rounded-full p-1 mx-auto mb-4" style={{ width: '128px', height: '128px' }}>
            <img
              className="w-full h-full object-cover rounded-full"
              src={profile.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
            />
          </div>
          <p className="text-2xl font-bold mb-2">{profile.name}</p>
          <p className="text-lg text-gray-700 mb-4">{profile.role}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
          <p className="text-gray-800 mb-2"><strong>ID:</strong> {displayId.toUpperCase()}</p>
          <p className="text-gray-800 mb-2"><strong>Phone:</strong> {profile.phone}</p>
          <p className="text-gray-800 mb-2"><strong>Email:</strong> {profile.email}</p>
          <p className="text-gray-800 mb-2"><strong>Address:</strong> {profile.address}</p>
        </div>
        <div className="mt-4 flex justify-center">
          <Barcode value={profile.id || '000000'} /> 
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
