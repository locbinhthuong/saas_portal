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
  
  // Kiểm tra xem có phải là Subdomain không
  // Bỏ qua localhost hoặc vercel app base domain
  const isSubdomain = hostname !== 'localhost' 
    && hostname !== '127.0.0.1' 
    && !hostname.startsWith('saas-portal-omega') // Tên miền Vercel của bạn
    && hostname.split('.').length >= 3; 
    
  if (isSubdomain) {
    const subdomain = hostname.split('.')[0];
    return (
      <BrowserRouter>
        <TenantApp subdomain={subdomain} />
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
