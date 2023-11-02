import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserView from './UserView';
import AdminView from './AdminView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/UserView" element={<UserView />} />
        <Route path="/AdminView" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
