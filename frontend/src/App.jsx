import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";

import Notification from "./components/notification";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="App">
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/Login" element={<Navigate to="/login" replace />} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/Register" element={<Navigate to="/register" replace />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
