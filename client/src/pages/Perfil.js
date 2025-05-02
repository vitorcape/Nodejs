import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Perfil() {
    const [usuario, setUsuario] = useState({ nome: '', email: '', idade: '', user: '' });
    const [msg, setMsg] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return navigate('/login');

        let userId;
        try {
            const decoded = jwtDecode(token);
            userId = decoded.id;
        } catch (err) {
            localStorage.removeItem('token');
            return navigate('/login');
        }

        const buscarUsuario = async () => {
            try {
                const res = await axios.get(`https://nodejs-production-b4a4.up.railway.app/usuarios/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsuario(res.data);
            } catch (err) {
                setErro('Erro ao carregar perfil');
            }
        };

        buscarUsuario();
    }, [token, navigate]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const salvar = async (e) => {
        e.preventDefault();
        setMsg('');
        setErro('');

        try {
            await axios.put(`https://nodejs-production-b4a4.up.railway.app/usuarios/${usuario._id}`, usuario, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Perfil atualizado com sucesso!');
        } catch (err) {
            setErro('Erro ao atualizar perfil');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <h3>Meu Perfil</h3>
            {msg && <div className="alert alert-success">{msg}</div>}
            {erro && <div className="alert alert-danger">{erro}</div>}
            <form onSubmit={salvar}>
                <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input className="form-control" name="nome" value={usuario.nome} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Usuário</label>
                    <input className="form-control" name="user" value={usuario.user || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" name="email" value={usuario.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Idade</label>
                    <input type="number" className="form-control" name="idade" value={usuario.idade || ''} onChange={handleChange} />
                </div>
                <button className="btn btn-primary w-100">Salvar</button>
            </form>
        </div>
    );
}

export default Perfil;