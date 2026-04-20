import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles.css";
import { AppStateProvider } from "./state";
import { AppLayout } from "./App";
import { HomePage } from "./pages/HomePage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { CreateTaskPage } from "./pages/CreateTaskPage";
import { DataLogsPage } from "./pages/DataLogsPage";
import { LeagueChallengePage } from "./pages/LeagueChallengePage";
import { LeagueCreatePage } from "./pages/LeagueCreatePage";
import { LeagueJoinPage } from "./pages/LeagueJoinPage";
import { LeaguePage } from "./pages/LeaguePage";
import { EmojiPickPage } from "./pages/EmojiPickPage";
import { ProfilePage } from "./pages/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tasks/new", element: <CreateTaskPage /> },
      { path: "tasks/:taskId", element: <TaskDetailPage /> },
      { path: "data", element: <DataLogsPage /> },
      { path: "league", element: <LeaguePage /> },
      { path: "league/create", element: <LeagueCreatePage /> },
      { path: "league/join", element: <LeagueJoinPage /> },
      { path: "league/challenge", element: <LeagueChallengePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "profile/emoji", element: <EmojiPickPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  </React.StrictMode>,
);

