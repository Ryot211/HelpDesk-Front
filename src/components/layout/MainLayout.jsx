import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
      <div className="flex">
        <Sidebar
          abierto={sidebarAbierto}
          onCerrar={() => setSidebarAbierto(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar onAbrirMenu={() => setSidebarAbierto(true)} />

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;