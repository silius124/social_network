import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import FriendPage from "./pages/FriendPage";
import MessagesPage from "./pages/MessagesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/friends" element={<FriendPage />} />

          <Route path="/message" element={<MessagesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
