import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import CustomerDashboard from './pages/CustomerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import TenantApp from './TenantApp';

function App() {
  const hostname = window.location.hostname;
  const urlParams = new URLSearchParams(window.location.search);
  const workspaceParam = urlParams.get('workspace');
  const tokenParam = urlParams.get('token');

  // Nếu có token trên URL (truyền từ Portal sang Workspace), lưu vào localStorage
  if (tokenParam) {
    localStorage.setItem('saas_auth_token', tokenParam);
    // Xóa token khỏi URL cho bảo mật
    window.history.replaceState({}, document.title, window.location.pathname + (workspaceParam ? `?workspace=${workspaceParam}` : ''));
  }
  
  // Kiểm tra xem có phải là Subdomain hoặc có param workspace không
  const isSubdomain = hostname !== 'localhost' 
    && hostname !== '127.0.0.1' 
    && !hostname.startsWith('saas-portal-omega') 
    && hostname.split('.').length >= 3; 
    
  const activeSubdomain = isSubdomain ? hostname.split('.')[0] : workspaceParam;
    
  if (activeSubdomain) {
    return (
      <BrowserRouter>
        <TenantApp subdomain={activeSubdomain} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout/:productId" element={<Checkout />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
