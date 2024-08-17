import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaFacebook,
  FaTwitter,
  FaGithub,
  FaDribbble,
  FaInstagram,
  FaUpload,
} from 'react-icons/fa';
import SkillIcons from '../assets/SkillsIcons';
import EditProfileModal from '../components/Modal'; // Import the modal

const ProfilePage = () => {
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    biography: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const storedData = localStorage.getItem('auth');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserID(parsedData.user.id);
        setToken(parsedData.token);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        if (userID && token) {
          const response = await axios.get(
            `/api/v1/auth/userprofile/${userID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("response", response)
          setUserProfile(response.data);
          setProfileData({
            name: response.data.user.name,
            email: response.data.user.email,
            biography: response.data.user.biography,
            phone: response.data.user.phone,
            address: response.data.user.address,
          });
        }
      } catch (error) {
        setError('Error fetching user profile');
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfileInfo();
  }, [userID, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!newProfilePic) {
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', newProfilePic);

    try {
      const response = await axios.put(
        `/api/v1/auth/update-pic/${userID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Profile photo updated successfully');
      setUserProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          profilePicture: response.data.profilePicture,
        },
      }));
    } catch (error) {
      toast.error('Error updating profile photo');
      console.error('Error updating profile photo:', error);
    }
  };

  const openEdit = () => setOpen(true);
  const closeEdit = () => setOpen(false);

  const handleProfileDataChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `/api/v1/auth/update-profile/${userID}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Profile updated successfully');
      setUserProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...profileData,
        },
      }));
      closeEdit();
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="bg-gray-900 h-full text-white rounded-lg shadow-lg p-6 flex">
      {/* Left Section */}
      <div className="w-1/2 pr-6">
        <div className="relative flex items-center space-x-4">
          <img
            className="w-32 h-32 rounded-full"
            src={
              previewPic ||
              userProfile.user.profilePicture?.url ||
              'https://via.placeholder.com/150'
            }
            alt="Profile"
          />
          <div className="ml-4 flex flex-col items-start">
            <label
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
              htmlFor="fileInput"
            >
              <FaUpload size={20} className="mr-2" />
              {previewPic ? previewPic.name : 'Update Photo'}
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            {previewPic && (
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpload}
              >
                Update Photo
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">{userProfile.user.name}</h1>
          <span className="bg-blue-500 text-xs px-2 py-1 rounded">
            {userProfile.user.role}
          </span>
        </div>

        {/* Biography */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Biography</h2>
          <p className="text-gray-400">
            {userProfile.user.biography || 'No biography available.'}
          </p>
        </div>

        {/* Socials */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Social</h2>
          <div className="flex space-x-4">
            {userProfile.user.socials?.twitter && (
              <a
                href={userProfile.user.socials.twitter}
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
            )}
            {userProfile.user.socials?.github && (
              <a
                href={userProfile.user.socials.github}
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={24} />
              </a>
            )}
            {userProfile.user.socials?.linkedin && (
              <a
                href={userProfile.user.socials.linkedin}
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={24} />
              </a>
            )}
            {userProfile.user.socials?.instagram && (
              <a
                href={userProfile.user.socials.instagram}
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} />
              </a>
            )}
            {userProfile.user.socials?.dribbble && (
              <a
                href={userProfile.user.socials.dribbble}
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDribbble size={24} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Location</h2>
          {userProfile.user.locations.length > 0 ? (
            <ul className="list-disc pl-5">
              {userProfile.user.locations.map((location, index) => (
                <li key={index}>{location}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No locations listed.</p>
          )}
        </div>

        {/* Job Title and Actions */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Job Title</h2>
          <p className="text-gray-400">{userProfile.user.role}</p>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={openEdit}
          >
            Edit
          </button>
          <EditProfileModal
            open={open}
            onClose={closeEdit}
            profileData={profileData}
            onProfileDataChange={handleProfileDataChange}
            onUpdate={handleUpdate}
          />
          <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
            Preview
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 pl-6">
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Email Address</h2>
          <p className="text-gray-400">{userProfile.user.email}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Home Address</h2>
          <p className="text-gray-400">{userProfile.user.address}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Phone Number</h2>
          <p className="text-gray-400">{userProfile.user.phone}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Software Skills</h2>
          <SkillIcons skills={userProfile.user.skills} />
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Languages</h2>
          <p className="text-gray-400">English, French, Spanish</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
