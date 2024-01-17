import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import './DashHeader.css';
import { useSelector } from 'react-redux';
import InfoPopup from './infopopup';

export default function DashHeader() {

    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:820px)");
  
    return (
        <Box sx={{display:'flex',justifyContent: 'space-between'}}>
            <Box className='nametag' sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton>
                    <AccountCircleIcon style={isNonMobileScreens?{ fontSize: 100 }:{fontSize:70}} />
                </IconButton>
                <Box>
                    <Typography style={isNonMobileScreens?{ fontSize: '1rem', fontWeight: 600 }:{fontSize: '0.9rem',fontWeight: 400}}>Good Day!!</Typography>
                    <Typography style={isNonMobileScreens?{ fontSize: '1.5rem', fontWeight: 600 }:{ fontSize: '1.2rem', fontWeight: 400 }}>{user.firstName+" "+user.lastName}</Typography>
                </Box>
            </Box>

            {isNonMobileScreens?<Box>
                <ul>
                    <li>8 files</li>
                    <li>1 folder</li>
                    <li>6.81 mb used of 2 gb</li>
                </ul>
            </Box>:<InfoPopup/>}
        </Box>

    );
}