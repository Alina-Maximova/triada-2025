import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from './component/Header';

import Products from './pages/Products';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import CartItem from './pages/Cart';
import { useSelector } from 'react-redux';
import About from './pages/About';


const App =()=> {
  const { token, user } = useSelector((state) => state.auth);
  return (
    <Router>
        <Header />

      <Container>
        <Routes>
          <Route path="/" exact element={<Home/>} />
             <Route path="/products" element={<Products/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/about" element={<About />} />

          {token&&<>
            <Route path="/cart" element={<CartItem/>} />
            <Route path="/orders" element={<Orders/>} />
          <Route path="/admin" element={<AdminPanel />} />

          </> 
          }
        
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
