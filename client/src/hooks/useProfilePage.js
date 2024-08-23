import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useProfile = () => {
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

  const handlePreview = async(e)=>{
    e.preventDefault()
    alert("hi cutie")
  }
  return {
    userProfile,
    previewPic,
    profileData,
    open,
    error,
    loading: !userProfile,
    handleFileChange,
    handleUpload,
    openEdit,
    closeEdit,
    handleProfileDataChange,
    handleUpdate,
    handlePreview
  };
};

export default useProfile;
