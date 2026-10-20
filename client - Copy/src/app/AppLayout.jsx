import { Outlet } from "react-router-dom";
import Sidebar from "../features/shared/components/Sidebar";
import TopBar from "../features/shared/components/TopBar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;