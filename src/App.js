import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Navigator from './components/MainNavigation/MainNavigation';
import Home from './screens/Home/Home';
import Commissions from './screens/Commissions/Commissions';
import About from './screens/About/About';
import RadLogo from './components/RadLogo/RadLogo';
import Portfolio from './screens/Portfolio/Portfolio';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <header>
          <Link to="/"><RadLogo /></Link>
          <Navigator />
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='commissions' element={<Commissions />} />
          <Route path='portfolio' element={<Portfolio />} />
          <Route path='about' element={<About />} />
        </Routes>
      </BrowserRouter>
    )
  };
}

export default App;
