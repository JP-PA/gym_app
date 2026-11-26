import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import AuthProvider from "./auth/AuthProvider.jsx";
import Personal from "./pages/personal.jsx";
import Routines from "./pages/routines.jsx";
import Login from "./pages/auth/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Usuarios from "./pages/users.jsx";
import Productos from "./pages/products.jsx";
import Ventas from "./pages/sells.jsx"
import Membresias from "./pages/memberships.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx"

function App() {

  return (

    <AuthProvider><BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute role="admin">
              <Productos/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sells"
          element={
            <ProtectedRoute role="admin">
              <Ventas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/memberships"
          element={
            <ProtectedRoute role="admin">
              <Membresias />
            </ProtectedRoute>
          }
        />



        <Route
          path="/admin/notificaciones"
          element={
            <ProtectedRoute role="admin">
              <Membresias key="notifications" notifications />
            </ProtectedRoute>
          }
        />

        <Route path="/rutinas" element={<ProtectedRoute><Routines /></ProtectedRoute>} />

        {["resumen", "perfil", "membresias", "compras"].map(section => <Route key={section} path={section === "resumen" ? "/mi" : `/mi/${section}`} element={<ProtectedRoute role="user"><Personal key={section} section={section} /></ProtectedRoute>} />)}
        <Route path="*" element={<Login />} />
      </Routes>

    </BrowserRouter></AuthProvider>

  );
}

export default App;

