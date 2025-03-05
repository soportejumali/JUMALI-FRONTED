import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Admin/Dashboard';
import Books from './components/Admin/Books';
import Users from './components/Admin/Users';
import Loans from './components/Admin/Loans';
import App from './App';
import Fines from './components/Admin/Fines';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import AllowedUsers from './components/Admin/AllowedUsers';
import UserLayout from './components/Users/UserLayout';
import UserProfile from './components/Users/UserProfile';
import UserCatalog from './components/Users/UserCatalog';
import UserLoans from './components/Users/UserLoans';
import UserFines from './components/Users/UserFines';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<App />} />
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/books" element={<AdminLayout><Books /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
        <Route path="/admin/loans" element={<AdminLayout><Loans /></AdminLayout>} />
        <Route path="/admin/fines" element={<AdminLayout><Fines /></AdminLayout>} />
        <Route path="/admin/allowed-users" element={<AdminLayout><AllowedUsers /></AdminLayout>} />
        <Route path="/usuario/perfil" element={<UserLayout><UserProfile /></UserLayout>} />
        <Route path="/usuario/catalogo" element={<UserLayout><UserCatalog /></UserLayout>} />
        <Route path="/usuario/prestamos" element={<UserLayout><UserLoans /></UserLayout>} />
        <Route path="/usuario/multas" element={<UserLayout><UserFines /></UserLayout>} />
      </Route>
    </Routes>
  </Router>
);