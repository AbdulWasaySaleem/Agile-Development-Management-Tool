import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gridTemplateRows: 'auto 1fr auto',
    height: '100vh',
  },
  sidebar: {
    gridColumn: '1 / 2',
    gridRow: '1 / 4',
    backgroundColor: '#1a202c', // bg-gray-900
    color: 'white',
    padding: '16px',
  },
  mainContent: {
    gridColumn: '2 / 3',
    gridRow: '1 / 4',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    borderBottom: '1px solid #e2e8f0', // border-gray-300
    backgroundColor: '#f7fafc', // bg-gray-100
    padding: '16px',
  },
  footer: {
    borderTop: '1px solid #e2e8f0', // border-gray-300
    backgroundColor: '#f7fafc', // bg-gray-100
    padding: '16px',
  },
  outlet: {
    flex: 1,
    padding: '16px'
  },
};

const Layout = () => {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div style={styles.mainContent}>
        {/* Header */}
        <Header style={styles.header}/>

        {/* Main content area (outlet) */}
        <main style={styles.outlet}>
          <Outlet />
        </main>

        {/* Footer */}
        <Footer style={styles.footer} />
      </div>
    </div>
  );
};

export default Layout;
