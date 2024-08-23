import React, { useState } from 'react';
import { FaHome, FaProjectDiagram, FaSignOutAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";

const NotFound = () => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    
    // Generate previews
    const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  // Handle file upload
  const handleUpload = async () => {
    // Example URL for file upload (you'll need to replace this with your own)
    const uploadUrl = 'https://your-upload-endpoint.example.com/upload';

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Files uploaded successfully');
        // Clear file previews after successful upload
        setFiles([]);
        setPreviews([]);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  // Clean up object URLs to avoid memory leaks
  React.useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const username = "John Doe"; 

  return (
    <>
    <div className="p-6 mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Upload Files</h1>
      
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
      />
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {previews.length > 0 && (
          previews.map((preview, index) => (
            <div key={index} className="relative">
              {/* Check file type and render accordingly */}
              {files[index].type.startsWith('image') ? (
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full  object-cover rounded-md"
                />
              ) : files[index].type.startsWith('video') ? (
                <video
                  src={preview}
                  controls
                  className="w-full object-cover rounded-md"
                />
              ) : null}
              <button
                onClick={() => {
                  // Remove file from the state and update previews
                  setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
                  setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                X
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleUpload}
        className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Upload
      </button>
    </div>

    <div className="flex flex-col h-full w-full max-w-[1400px] bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img 
            src="https://via.placeholder.com/40" 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-bold">Username</p>
            <p className="text-sm text-gray-400">Active now</p>
          </div>
        </div>
        <div>
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-end mb-2">
          <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
            <p>This is a message from you!</p>
          </div>
        </div>
        <div className="flex justify-start mb-2">
          <div className="bg-gray-700 text-white p-3 rounded-lg max-w-xs">
            <p>This is a message from the other user!</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button className="ml-3 text-blue-500 hover:text-blue-400">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
    

    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <AiOutlineUser className="text-xl" />
          <span className="text-lg">{username}</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <FaHome />
            <span>Home</span>
          </a>
          <a href="/projects" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <FaProjectDiagram />
            <span>Projects</span>
          </a>
          <a href="/settings" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <FiSettings />
            <span>Settings</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cards or Content Blocks */}
          <div className="p-4 bg-white shadow rounded-lg">Overview</div>
          <div className="p-4 bg-white shadow rounded-lg">Tasks</div>
          <div className="p-4 bg-white shadow rounded-lg">Reports</div>
        </div>
      </main>
    </div>
    </>
  );
};

export default NotFound;
