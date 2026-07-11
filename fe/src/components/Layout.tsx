import { normalizeRole } from '../utils/role';
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  Mic,
  LayoutGrid,
  ScrollText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Building2,
  Layers,
  Settings,
  Scale,
} from "lucide-react";

const adminMenus = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <CalendarDays size={18} />,
    label: "Seminar",
    path: "/admin/seminar",
  },
  {
    icon: <LayoutGrid size={18} />,
    label: "Kategori",
    path: "/admin/category",
  },
  {
    icon: <Mic size={18} />,
    label: "Speaker",
    path: "/admin/speaker",
  },
  {
    icon: <Building2 size={18} />,
    label: "Fasilitas",
    path: "/admin/fasilitas",
  },
  {
    icon: <Layers size={18} />,
    label: "Level",
    path: "/admin/level",
  },
  {
    label: "Kelola Kriteria",
    path: "/admin/kriteria",
    icon: <Settings size={18} />,
},
{
    label: "Kelola Bobot",
    path: "/admin/bobot",
    icon: <Scale size={18} />,
},
  
  // {
  //   icon: <Calculator size={18} />,
  //   label: "SPK",
  //   path: "/admin/spk",
  // },
];

const userMenus = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    path: "/home",
  },
  {
    icon: <CalendarDays size={18} />,
    label: "Seminar",
    path: "/seminars",
  },
  {
    icon: <ScrollText size={18} />,
    label: "Pendaftaran Saya",
    path: "/my-registration",
  },
  {
    icon: <User size={18} />,
    label: "Profil",
    path: "/profile",
  },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const userRole = normalizeRole(user?.role);


  const menus = user?.role === "ADMIN" ? adminMenus : userMenus;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: collapsed ? "64px" : "240px",
          backgroundColor: "#8b1e2b",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 99,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 16px",
            display: "flex",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,.1)",
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <CalendarDays color="white" size={22} />
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                SeminarKu
              </span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div
            style={{
              padding: "16px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255,255,255,.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <User color="white" size={18} />
            </div>

            <div>
              <div
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {user?.name}
              </div>

              <div
                style={{
                  color: "#fca5a5",
                  fontSize: "12px",
                  marginTop: "2px",
                }}
              >
                {user?.role}
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <div style={{ flex: 1, padding: "10px" }}>
          {menus.map((menu, index) => {
            const active = location.pathname === menu.path;

            return (
              <button
                key={index}
                onClick={() => navigate(menu.path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  marginBottom: "6px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: active
                    ? "rgba(255,255,255,.18)"
                    : "transparent",
                  color: "white",
                }}
              >
                {menu.icon}

                {!collapsed && (
                  <>
                    <span style={{ flex: 1, textAlign: "left" }}>
                      {menu.label}
                    </span>

                    {active && <ChevronRight size={16} />}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div
          style={{
            padding: "10px",
            borderTop: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "rgba(255,255,255,.1)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          marginLeft: collapsed ? "64px" : "240px",
          flex: 1,
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "18px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 5px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {menus.find((m) => m.path === location.pathname)?.label ??
              "Dashboard"}
          </h2>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <User size={16} />
            {user?.name}
          </div>
        </div>

        <div style={{ padding: "30px" }}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
