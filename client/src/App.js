import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Perfil from './pages/Perfil';
import AlterarSenha from './pages/AlterarSenha';
import AdminPanel from './pages/AdminPanel';
import Logs from './pages/Logs';
import Posts from './pages/Posts';
import CriarPost from './pages/CriarPost';

function App() {
    return (
        <Router>
            <Header />
            <div className="container my-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/alterar-senha" element={<AlterarSenha />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/criar-post" element={<CriarPost />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;