import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaGithub, FaDribbble, FaInstagram, FaUpload } from 'react-icons/fa';
import SkillIcons from '../assets/SkillsIcons';
import EditProfileModal from '../components/Modal'; // Import the modal
import ProfileCard from '../components/ProfileCard'; // Import the ProfileCard component
import useProfile from '../hooks/useProfilePage'; // Import the custom hook

const ProfilePage = () => {
  const [isProfileCardOpen, setProfileCardOpen] = useState(false);

  const {
    userProfile,
    previewPic,
    profileData,
    open,
    error,
    loading,
    handleFileChange,
    handleUpload,
    openEdit,
    closeEdit,
    handleProfileDataChange,
    handleUpdate,
  } = useProfile();

  if (error) return <div className="text-red-600">{error}</div>;
  if (loading) return <div className="text-blue-600">Loading...</div>;

  const profile = {
    id: userProfile.user._id,
    name: userProfile.user.name,
    role: userProfile.user.role,
    email: userProfile.user.email,
    phone: userProfile.user.phone,
    address: userProfile.user.address,
    profilePicture: userProfile.user.profilePicture.url,
  };

  return (
    <div className="bg-white h-full text-gray-900 rounded-lg shadow-lg p-8 flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 pr-6 border-r border-gray-200">
        <div className="relative flex items-center space-x-6">
          <img
            className="w-36 h-36 rounded-full border border-gray-200"
            src={
              previewPic ||
              userProfile.user.profilePicture?.url ||
              'https://via.placeholder.com/150'
            }
            alt="Profile"
          />
          <div className="ml-4 flex flex-col items-start">
            <label
              className="flex items-center border border-gray-300 text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
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
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleUpload}
              >
                Update Photo
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-4xl font-semibold mb-2">{userProfile.user.name}</h1>
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg">
            {userProfile.user.role}
          </span>
        </div>

        {/* Biography */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Biography</h2>
          <p className="text-gray-800">
            {userProfile.user.biography || 'No biography available.'}
          </p>
        </div>

        {/* Socials */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Social</h2>
          <div className="flex space-x-4">
            {userProfile.user.socials?.twitter && (
              <a
                href={userProfile.user.socials.twitter}
                className="text-gray-700 hover:text-blue-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={28} />
              </a>
            )}
            {userProfile.user.socials?.github && (
              <a
                href={userProfile.user.socials.github}
                className="text-gray-700 hover:text-black transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={28} />
              </a>
            )}
            {userProfile.user.socials?.linkedin && (
              <a
                href={userProfile.user.socials.linkedin}
                className="text-gray-700 hover:text-blue-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={28} />
              </a>
            )}
            {userProfile.user.socials?.instagram && (
              <a
                href={userProfile.user.socials.instagram}
                className="text-gray-700 hover:text-pink-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={28} />
              </a>
            )}
            {userProfile.user.socials?.dribbble && (
              <a
                href={userProfile.user.socials.dribbble}
                className="text-gray-700 hover:text-pink-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDribbble size={28} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Location</h2>
          {userProfile.user.locations.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-800">
              {userProfile.user.locations.map((location, index) => (
                <li key={index}>{location}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-800">No locations listed.</p>
          )}
        </div>

        {/* Job Title and Actions */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Job Title</h2>
          <p className="text-gray-800">{userProfile.user.role}</p>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
          <button
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            onClick={() => setProfileCardOpen(true)}
          >
            Preview
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 pl-6">
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Email Address</h2>
          <p className="text-gray-800">{userProfile.user.email}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Home Address</h2>
          <p className="text-gray-800">{userProfile.user.address}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Phone Number</h2>
          <p className="text-gray-800">{userProfile.user.phone}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Software Skills</h2>
          <SkillIcons skills={userProfile.user.skills} />
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Languages</h2>
          <p className="text-gray-800">English, French, Spanish</p>
        </div>
      </div>

      {/* Profile Card */}
      {isProfileCardOpen && (
        <ProfileCard
          profile={profile}
          onClose={() => setProfileCardOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
