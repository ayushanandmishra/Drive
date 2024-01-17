import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useMediaQuery } from '@mui/material';

const File = ({ fileName, fileType, fileOwner, fileSize = 32456, fileId }) => {

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const settings = ['Download', 'Share', 'Delete', 'FIle Info'];
    const isNonMobileScreens = useMediaQuery("(min-width:820px)");

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const Icon = () => {
        if (fileType === 'video') {
            return (<PlayArrowIcon />)
        } else if (fileType === 'image') {
            return (<ImageIcon />)
        } else if (fileType === 'pdf') {
            return (<PictureAsPdfIcon />)
        } else {
            return (<InsertDriveFileIcon />);
        }
    }

    if (fileName.length > 20) {
        fileName = fileName.substring(0, 20) + "...";
    }

    const handleDelete = async () => {

        try {
            const response = await fetch(`http://localhost:3001/deletefile/${fileId}`,
                {
                    method: 'DELETE'
                })
        }
        catch (err) {
            console.log({ message: err.message });
        }
    }

    return (
        <ListItem>
            <ListItemIcon>
                {Icon()}
            </ListItemIcon>
            <ListItemText>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">{isNonMobileScreens ? fileName : fileName.substring(0, 9) + "..."}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Owner: {fileOwner}
                        </Typography>
                    </Box>
                    {/* <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Type: {fileType}
                        </Typography>
                    </Box> */}
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Size: {fileSize}
                        </Typography>
                    </Box>
                    <Box>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => { console.log('download'); handleCloseUserMenu(); }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center' }} textAlign="center">
                                    <DownloadIcon sx={{ mr: 1 }} fontSize='small' />
                                    <span>Download</span>
                                </Typography>
                            </MenuItem>
                            <MenuItem sx={{ display: 'flex', alignItems: 'center' }} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">
                                    <ShareIcon sx={{ mr: 1 }} fontSize='small' />
                                    <span>Share</span>
                                </Typography>
                            </MenuItem>
                            <MenuItem sx={{ display: 'flex', alignItems: 'center' }} onClick={handleDelete}>
                                <Typography textAlign="center">
                                    <DeleteIcon sx={{ mr: 1 }} fontSize='small' />
                                    <span>Delete</span>
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </ListItemText>
        </ListItem>
    );
};

const FileList = ({ files }) => {
    return (
        <List>
            {files.map((file, index) => (
                <File
                    key={index}
                    fileId={file._id}
                    fileName={file.fileName}
                    fileOwner={file.fileOwner}
                    fileType={file.fileType}
                    fileSize={file.fileSize}
                />
            ))}
        </List>
    );
};

export default FileList;