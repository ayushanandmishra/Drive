import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalViewer = ({ fileurl, fileType, onClose }) => {

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide in={false} unmountOnExit direction="up" ref={ref} {...props}  />;
      });

  return (
    <Dialog open={true}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
      fullWidth >
      <DialogTitle>
        
        <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{display:'flex',justifyContent:'center'}}>
        {/* Render the file content based on fileType */}
        {fileType === 'pdf' && <iframe src={fileurl} title="PDF Viewer" width="80%" height="600px" />}
        {fileType === 'jpeg' && <img src={fileurl} alt="Image Preview" style={{ width: '80%' }} />}
        {fileType === 'mp4' && (
          <video width="80%" height="auto" controls>
            <source src={fileurl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalViewer;