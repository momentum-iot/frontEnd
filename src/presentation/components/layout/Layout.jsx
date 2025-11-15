import React from 'react';
import { Sidebar } from './SideBar.jsx';
import { Topbar } from './TopBar.jsx';
import "./Layout.css"

export const Layout = ({ children }) => {
  return (
    <div className="container">
      
      <Sidebar />
      
      
      <div className="content">
        
        <Topbar />
        

        <main className="main">
          {children}
        </main>
      </div>
    </div>
  );
};