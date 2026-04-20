import { LeaguePanel } from "../components/LeaguePanel";
import { TaskList } from "../components/TaskList";

export function HomePage() {
  return (
    <div className="dashboardLayout">
      <TaskList />
      <LeaguePanel />
    </div>
  );
}
