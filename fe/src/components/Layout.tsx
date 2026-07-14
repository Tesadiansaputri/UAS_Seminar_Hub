import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";
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
    label: "Kelola Perhitungan SPK",
    path: "/admin/perhitungan-spk",
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
    path: "/seminar",
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


  const menus = user?.role === "ADMIN" ? adminMenus : userMenus;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="admin-shell"
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background:
          "linear-gradient(135deg, #fff7f8 0%, #f8fafc 46%, #fff1f3 100%)",
      }}
    >
      {/* Sidebar */}
      <div
        className="admin-sidebar"
        style={{
          width: collapsed ? "64px" : "240px",
          background:
            "linear-gradient(180deg, #7f1020 0%, #8b1e2b 46%, #2a1118 100%)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 99,
          boxShadow: "18px 0 45px rgba(139, 30, 43, 0.18)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 16px",
            display: "flex",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,.14)",
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <BrandLogo
                width={166}
                style={{
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: "34px",
              height: "34px",
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.16)",
              borderRadius: "8px",
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
              borderBottom: "1px solid rgba(255,255,255,.14)",
              background: "rgba(255,255,255,.06)",
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
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.18)",
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
                  fontWeight: 700,
                }}
              >
                {user?.role}
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <div
          className="admin-sidebar-menu"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px",
          }}
        >
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
                    ? "rgba(255,255,255,.2)"
                    : "transparent",
                  color: "white",
                  fontWeight: active ? 800 : 600,
                  boxShadow: active
                    ? "inset 0 1px 0 rgba(255,255,255,.2)"
                    : "none",
                  transition: "background .2s ease, transform .2s ease",
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
            borderTop: "1px solid rgba(255,255,255,.14)",
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
              background: "rgba(255,255,255,.12)",
              color: "white",
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 700,
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
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top right, rgba(217,52,86,.12), transparent 34%), linear-gradient(135deg, #fff7f8 0%, #f8fafc 48%, #fff1f3 100%)",
          transition: "margin-left 0.3s",
        }}
      >
        <div
          className="admin-topbar"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "rgba(255,255,255,.9)",
            padding: "18px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(139,30,43,.1)",
            boxShadow: "0 14px 38px rgba(139,30,43,.08)",
            backdropFilter: "blur(18px)",
          }}
        >
          <h2 style={{ margin: 0, color: "#171923", fontWeight: 900 }}>
            {menus.find((m) => m.path === location.pathname)?.label ??
              "Dashboard"}
          </h2>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              color: "#8b1e2b",
              fontWeight: 800,
            }}
          >
            <User size={16} />
            {user?.name}
          </div>
        </div>

        <div className="admin-content-surface" style={{ padding: "30px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
