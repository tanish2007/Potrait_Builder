// src/App.js
import React, { useState } from 'react';


import PortraitImporter from './components/PortraitImporter';
import { BrowserRouter ,Routes,Route} from "react-router-dom";
import PortraitOrganizer from './components/PotraitOrganizer';
import PSPAUpload from './components/pspa-upload';
import PSPAUploadPage from './components/preview';

function App() {


  return (
   <>
   <BrowserRouter>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<PortraitImporter/>} />
<Route path="/1" element={<PortraitOrganizer/>}/>
<Route path="/2" element={<PSPAUpload/>}/>
<Route path="/3" element={<PSPAUploadPage/>}/>
      </Routes>
    </BrowserRouter>
  
   
   </>
  );
}

export default App;







