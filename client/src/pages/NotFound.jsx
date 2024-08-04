import React, { useState } from 'react';

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

  return (
    <div className="p-6 mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Upload Files</h1>
      
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
      />
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto">
        {previews.length > 0 && (
          previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="w-full object-cover rounded-md"
              />
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
  );
};

export default NotFound;
