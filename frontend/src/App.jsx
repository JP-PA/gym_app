import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/auth/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Usuarios from "./pages/users.jsx";
import Productos from "./pages/products.jsx";
import Ventas from "./pages/sells.jsx"
import Membresias from "./pages/memberships.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Productos/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sells"
          element={
            <ProtectedRoute>
              <Ventas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/memberships"
          element={
            <ProtectedRoute>
              <Membresias />
            </ProtectedRoute>
          }
        />



      </Routes>

    </BrowserRouter>

  );
}

export default App;

