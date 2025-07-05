// src/App.js
import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import UploadConfirm from './components/UploadConfirm';
import OrganizationSelect from './components/PotraitOrganizer';
import PreviewEditor from './components/PreviewEditor';
import PortraitImporter from './components/PortraitImporter';
import { BrowserRouter ,Routes,Route} from "react-router-dom";
import PortraitOrganizer from './components/PotraitOrganizer';
import PSPAUpload from './components/pspa-upload';

function App() {


  return (
   <>
   <BrowserRouter>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<PortraitImporter/>} />
<Route path="/1" element={<PortraitOrganizer/>}/>
<Route path="/2" element={<PSPAUpload/>}/>
      </Routes>
    </BrowserRouter>
  
   
   </>
  );
}

export default App;







