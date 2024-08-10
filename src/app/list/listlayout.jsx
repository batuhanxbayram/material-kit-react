import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Grid, Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <div>
      {/* Navbar bileşeni */}
      <Navbar />
      
      {/* İçerik ve Sidebar */}
      <Grid container>
        {/* Sidebar bileşeni */}
        <Grid item xs={3}>
          <Sidebar />
        </Grid>

        {/* Sayfa içeriği */}
        <Grid item xs={9}>
          <Box p={3}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Layout;
