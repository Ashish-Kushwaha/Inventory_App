
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import Invoices from './pages/Invoices';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import {  useState } from 'react';
import Setting from './components/Setting';
import PrivateRoute from './components/PrivateRoute';

function App() {
 
     const [isLoggedIn, setIsLoggedIn] = useState(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? true : false;
});
  const [isMobile,setIsMobile]=useState(window.innerWidth <= 430)

  return (
    <Router>
      <Routes>
        <Route path='*' element={<div>Page is not present</div>} />
        <Route path="/login" element={<Login isMobile={isMobile}
       setIsMobile={setIsMobile} setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/signup" element={<Signup isMobile={isMobile}
       setIsMobile={setIsMobile} setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn}><Layout isMobile={isMobile}
       setIsMobile={setIsMobile} /></PrivateRoute>}>
        {/* <Route path="/" element={<Layout isMobile={isMobile}
       setIsMobile={setIsMobile} />}> */}
          <Route index element={<Dashboard  isMobile={isMobile}
       setIsMobile={setIsMobile}/>} />
          <Route path='product' element={<Product isMobile={isMobile}
       setIsMobile={setIsMobile} />} />
          <Route path='invoices' element={<Invoices isMobile={isMobile}
       setIsMobile={setIsMobile} />} />
          <Route path='statistics' element={<Statistics isMobile={isMobile}
       setIsMobile={setIsMobile} />} />
          <Route path='settings' element={isMobile?<Setting setIsLoggedIn={setIsLoggedIn}/>:<Settings isMobile={isMobile}
       setIsLoggedIn={setIsLoggedIn} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 
