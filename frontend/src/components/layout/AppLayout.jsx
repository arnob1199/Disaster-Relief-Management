import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return <div className="app-shell"><Navbar onMenuToggle={() => setOpen(true)} /><Sidebar open={open} onClose={() => setOpen(false)} />{open && <div className="sidebar-overlay d-lg-none" onClick={() => setOpen(false)} />}<main className="app-content"><Outlet /><Footer /></main></div>;
}
