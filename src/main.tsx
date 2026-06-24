import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./styles.css";
import App from "./App.tsx";
import Home from "./components/Home.tsx";
import GenreView from "./components/GenreView.tsx";
import TopicView from "./components/TopicView.tsx";
import QuizPage from "./components/QuizPage.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "genre/:genreId", element: <GenreView /> },
      { path: "genre/:genreId/topic/:topicId", element: <TopicView /> },
      { path: "genre/:genreId/quiz", element: <QuizPage /> },
      { path: "genre/:genreId/topic/:topicId/quiz", element: <QuizPage /> },
    ],
  },
]);

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
