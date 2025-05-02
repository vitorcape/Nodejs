import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // Captura token após login com Discord
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenDiscord = params.get('token');

        if (tokenDiscord) {
            localStorage.setItem('token', tokenDiscord);
            setToken(tokenDiscord);
            navigate('/dashboard');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');

        try {
            const response = await axios.post('https://nodejs-production-b4a4.up.railway.app/auth/login', {
                email,
                senha
            });

            const tokenRecebido = response.data.token;
            setToken(tokenRecebido);
            localStorage.setItem('token', tokenRecebido);
            alert('Login realizado com sucesso!');
            navigate('/dashboard');
        } catch (err) {
            setErro(err.response?.data?.error || 'Erro ao fazer login');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h3 className="mb-3">Login</h3>
            {erro && <div className="alert alert-danger">{erro}</div>}
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Senha:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <div className="d-grid gap-2 mb-3">
                    <a
                        className="btn btn-secondary"
                        href="https://discord.com/api/oauth2/authorize?client_id=1367606726102351973&redirect_uri=https%3A%2F%2Fnodejs-production-b4a4.up.railway.app%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email&prompt=none"
                    >
                        Entrar com Discord
                    </a>
                </div>

                <button className="btn btn-primary w-100" type="submit">Entrar</button>
            </form>

            {token && (
                <div className="mt-3">
                    <strong>Token salvo:</strong>
                    <pre className="small">{token}</pre>
                </div>
            )}
        </div>
    );
}

export default Login;
