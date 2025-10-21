

import './App.css'
import HomePage from './component/HomePage'
import Authentication from './component/Authentication';
import PrivateRoute from './component/PrivateRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
 

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
   <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
   
     
    </Routes>
     </Router>
    </>
  )
}

export default App
