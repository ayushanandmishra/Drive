import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AdbIcon from '@mui/icons-material/Adb';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ width: '100%', top: 0 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          Drive
        </Typography>
        <AdbIcon />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;