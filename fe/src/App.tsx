import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import Layout from "./components/Layout";
import UserLayout from "./components/UserLayout";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User
import LandingPage from "./pages/user/LandingPage";
import Home from "./pages/user/Home";
import UserSeminarList from "./pages/user/SeminarList";
import Profile from "./pages/user/Profile";
import Recommendation from "./pages/user/Recommendation";
import Hasil from "./pages/user/Hasil";





// import Bobot from "./pages/user/Bobot";
// import Hasil from "./pages/user/Hasil";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import CategoryList from "./pages/admin/CategoryList";
import SpeakerList from "./pages/admin/SpeakerList";
import SeminarListAdmin from "./pages/admin/SeminarList";



// Super Admin
import SuperAdminDashboard from "./pages/super_admin/Dashboard";
import DetailSeminar from "./pages/user/DetailSeminar";
import AdminList from "./pages/super_admin/AdminList";
import UserList from "./pages/super_admin/UserList";
import LevelList from "./pages/admin/LevelList";
import FasilitasList from "./pages/admin/FasilitasList";
import BobotList from "./pages/admin/BobotList";
import PerhitunganSPK from "./pages/admin/PerhitunganSPK";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ================= */}

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />





          {/* ================= USER ================= */}

          <Route
            path="/home"
            element={
              <ProtectedRoute role="USER">
                <UserLayout>
                  <Home />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seminar"
            element={
              <ProtectedRoute role="USER">
                <UserLayout>
                  <UserSeminarList />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seminar/:id"
            element={
              <ProtectedRoute role="USER">
                <UserLayout>
                  <DetailSeminar />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute role="USER">
                <UserLayout>
                  <Profile />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          

           <Route
            path="/recommendation" 
            element={
              <ProtectedRoute role="USER">
                <UserLayout>
                  <Recommendation />
                </UserLayout>
              </ProtectedRoute>
            }
          /> 

           <Route
            path="/hasil"
            element={
              <ProtectedRoute role="USER">
                <UserLayout>
                  <Hasil />
                </UserLayout>
              </ProtectedRoute>
            }
          />  

          {/* ================= ADMIN ================= */}

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/seminar"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <SeminarListAdmin />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/category"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <CategoryList />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/speaker"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <SpeakerList />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/fasilitas"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <FasilitasList />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/level"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <LevelList />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/perhitungan-spk"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <PerhitunganSPK />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/bobot"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <BobotList />
      </Layout>
    </ProtectedRoute>
  }
/>

{/* <Route
  path="/admin/rating"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <RatingList />
      </Layout>
    </ProtectedRoute>
  }
/> */}

{/* <Route
  path="/admin/registration"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <RegistrationList />
      </Layout>
    </ProtectedRoute>
  }
/> */}

{/* <Route
  path="/admin/spk"
  element={
    <ProtectedRoute role="ADMIN">
      <Layout>
        <SpkSaw />
      </Layout>
    </ProtectedRoute>
  }
/> */}

          {/* ================= SUPER ADMIN ================= */}

          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute role="SUPER_ADMIN">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/admin"
            element={
              <ProtectedRoute role="SUPER_ADMIN">
                <AdminList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/user"
            element={
              <ProtectedRoute role="SUPER_ADMIN">
                <UserList />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
