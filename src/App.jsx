import React, { useState } from "react";
import AppLayout from "./layout/AppLayout";
import PageRouter from "./routes";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const {
    auth,
    role,
    userType,
    showLogout,
    setShowLogout,
    setUserType,
    handleLogin,
    handleSetRole,
    handleLogoutConfirm,
  } = useAuth();

  const [page, setPage] = useState("overview");

  const handleNav = (newPage, newRole) => {
    if (newRole !== undefined) {
      handleSetRole(newRole);
      setPage("overview");
    } else {
      setPage(newPage);
    }
  };

  if (!auth)
    return <Login onLogin={handleLogin} />;

  if (showLogout)
    return (
      <Logout
        role={role}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogout(false)}
      />
    );

  return (
    <AppLayout
      role={role}
      setRole={(r) => { handleSetRole(r); setPage("overview"); }}
      page={page}
      setPage={handleNav}
      onLogout={() => setShowLogout(true)}
    >
      <PageRouter
        page={page}
        role={role}
        userType={userType}
        setUserType={setUserType}
        setPage={handleNav}
      />
    </AppLayout>
  );
}
