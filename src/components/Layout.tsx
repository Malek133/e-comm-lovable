
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
