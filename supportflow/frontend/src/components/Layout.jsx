import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="page-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
