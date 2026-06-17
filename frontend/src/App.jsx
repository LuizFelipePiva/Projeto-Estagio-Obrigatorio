

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Page imports

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Curriculum from "./pages/Curriculum";

// Component imports

import Notification from "./components/notification";
import PrivateLayout from "./components/PrivateLayout";

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
            element={
              <PrivateRoute>
                <PrivateLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/curriculum" element={<Curriculum />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
