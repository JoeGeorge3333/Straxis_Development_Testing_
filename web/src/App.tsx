import { Outlet } from "react-router-dom";

import { BottomNav } from "./components/BottomNav";
import { DayBoundaryWatcher } from "./components/DayBoundaryWatcher";
import { Header } from "./components/Header";

export function AppLayout() {
  return (
    <div className="appShell">
      <DayBoundaryWatcher />
      <Header />
      <div className="main">
        <main className="content">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

