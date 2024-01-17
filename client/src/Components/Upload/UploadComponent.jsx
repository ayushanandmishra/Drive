import React from 'react';
import FileUpload from './Upload.jsx';
import { Box } from '@mui/material';

const UploadComponent = ({change}) => {
  const handleFileUpload = (files) => {
    // Perform actions with the selected files (e.g., upload to server)
    console.log('Selected Files:', files);
  };

  return (
    <Box sx={{mt:3}}>
      <FileUpload change={change} onFileUpload={handleFileUpload} />
    </Box>
  );
};

export default UploadComponent;