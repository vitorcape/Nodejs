import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    let role = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            role = decoded.role;
        } catch (err) {
            console.error('Token inválido');
            localStorage.removeItem('token');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand" to="/">CRUD JWT</Link>
            <div className="navbar-nav me-auto">
                {!token && (
                    <>
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link" to="/register">Cadastro</Link>
                    </>
                )}

                {token && (
                    <>
                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        <Link className="nav-link" to="/perfil">Perfil</Link>
                        <Link className="nav-link" to="/posts">Posts</Link>
                        <Link className="nav-link" to="/criar-post">Criar post</Link>
                        <Link className="nav-link" to="/alterar-senha">Alterar Senha</Link>
                    </>
                )}

                {role === 'admin' && (
                    <>
                        <Link className="nav-link" to="/admin">Admin</Link>
                        <Link className="nav-link" to="/logs">Logs</Link>
                    </>
                )}
            </div>

            {token && (
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Header;