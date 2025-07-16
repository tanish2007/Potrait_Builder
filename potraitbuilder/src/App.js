// src/App.js


import PortraitImporter from './components/PortraitImporter';
import { BrowserRouter ,Routes,Route} from "react-router-dom";
import PortraitOrganizer from './components/PotraitOrganizer';
import PSPAUpload from './components/pspa-upload';
import PSPAUploadPage from './components/preview';
import NavigationPage from './components/Home';
import EditPSPAPage from './components/edit';

function App() {


  return (
   <>
   <BrowserRouter>
      <Routes>
        {/* Define the routes */}
         <Route path="/" element={<NavigationPage/>} />
          <Route path="/edit" element={<EditPSPAPage/>} />
        <Route path="/1" element={<PortraitImporter/>} />
<Route path="/2" element={<PortraitOrganizer/>}/>
<Route path="/3" element={<PSPAUpload/>}/>
<Route path="/4" element={<PSPAUploadPage/>}/>
      </Routes>
    </BrowserRouter>
  
   
   </>
  );
}

export default App;







