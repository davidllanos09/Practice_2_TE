import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {About} from './components/About'
import {Professors} from './components/Professors'
import {Navbar} from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <div className='container p-2'>
        <Routes>
            <Route path='/about' element={<About/>}/>
            <Route path='/' element={<Professors/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
