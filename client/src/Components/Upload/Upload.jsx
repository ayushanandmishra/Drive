import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux"
import { setRender } from '../../reduxStore/state';
import { useDispatch } from 'react-redux';
import './Upload.css';


const FileUpload = ({ onFileUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const isNonMobileScreens = useMediaQuery('(min-width:820px)');
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const rerender=useSelector((state)=>state.render);
  const dispatch=useDispatch();

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const submit = async () => {
    
    const formData = new FormData();
    formData.append("image", selectedFiles[0])
    formData.append("id", user._id);
    formData.append("email", user.email);
    formData.append("username",`${user.firstName} ${user.lastName}`);

    // await axios.post("http://localhost:3001/api/posts", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    const response = await fetch(`http://localhost:3001/api/posts`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`
      },
      body: formData,
    });

    dispatch(
      setRender({
          render:!rerender
      })
  )
    return response;
  }

  const handleUpload = async() => {
    if (selectedFiles) {
      // You can perform additional actions before uploading, if needed

      onFileUpload(selectedFiles);
      const res=await submit();
      // Clear the selected files after upload
      setSelectedFiles(null);
    }
  };

  const handleReject = () => {
    setSelectedFiles(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isNonMobileScreens ? 'row' : 'column', // Change to column for screens less than 820px
        justifyContent: isNonMobileScreens ? 'space-between' : 'center',
        alignItems: isNonMobileScreens ? 'center' : 'center', // Align center for all screens
        mt:3
      }}
      className="uploadContainer"
    >
      <input
        type="file"
        id="fileInput"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="fileInput" className="UploadBtn">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload Files
        </Button>
      </label>
      {selectedFiles && (
        <div className="fileName" style={{ marginTop: '0px' }}>
          <strong style={{fontSize:'1rem'}}>Selected File:</strong>
          <ul>
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <Box>
        {selectedFiles && (
          <Button
            sx={isNonMobileScreens?{mr:1}:{mt:3,mr:1}}
            className="removeBtn"
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!selectedFiles}
          >
            {isNonMobileScreens ? 'Remove' : <CloseIcon />}
          </Button>
        )}
        <Button
            sx={isNonMobileScreens?{}:{mt:3,ml:1}}
          className="uploadBtn"
          variant="contained"
          color="success"
          onClick={handleUpload}
          disabled={!selectedFiles}
        >
          {isNonMobileScreens ? 'Upload' : <CloudUploadIcon />}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;