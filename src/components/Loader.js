import React, { useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({value}) => {

  return (
    <>
    {/*<div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>*/}
 
 <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-5 z-50">
      <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-r-2 border-gray-900"></div>
    </div>

    {/*<div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={value}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
</div>*/}
    </>
  );
}

export default Loader;
