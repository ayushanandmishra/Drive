import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box } from '@mui/material';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import './DashHeader.css';

export default function DashHeader() {
    const [name, setName] = useState('Ayush Anand');

    return (
        <Box sx={{display:'flex',justifyContent: 'space-between'}}>
            <Box className='nametag' sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton>
                    <AccountCircleIcon style={{ fontSize: 100 }} />
                </IconButton>
                <Box>
                    <Typography style={{ fontSize: '1rem', fontWeight: 600 }}>Good Day!!</Typography>
                    <Typography style={{ fontSize: '1.5rem', fontWeight: 600 }}>{name}</Typography>
                </Box>
            </Box>

            <Box>
                <ul>
                    <li>8 files</li>
                    <li>1 folder</li>
                    <li>6.81 mb used of 2 gb</li>
                </ul>
            </Box>
        </Box>

    );
}