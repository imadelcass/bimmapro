import './App.css';
import Home from './pages/index';
import Login from './pages/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Context } from './components/AuthContext';
import { useState } from 'react';

function App() {
  const [admin, setAdmin] = useState({
    state: false,
    user: {},
  });
  return (
    <Context.Provider value={{ admin, setAdmin }}>
      <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Context.Provider>
  );
}

export default App;
