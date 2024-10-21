import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BookNow from './pages/BookNow';
import LoginSignup from './pages/LoginSignup';
import ImageAnnotator from './pages/ImageAnnotator';

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<BookNow />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/img" element={<ImageAnnotator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;