import { useState } from 'react'
import { RouterProvider } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function App() {
  

  return (
    <>
    
      <ToastContainer
        style={{zIndex:"9999999"}}
        hideProgressBar={true}
        position="bottom-left"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
      />
      
      <RouterProvider router={router} />
    
    </>
  )
}

export default App
