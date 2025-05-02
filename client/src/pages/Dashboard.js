import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [busca, setBusca] = useState('');
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState('');
    const [nickname, setNickname] = useState('');
    const [usuarios, setUsuarios] = useState([]);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const decoded = jwtDecode(token);
        const meuId = decoded.id;

        const buscarTodos = async () => {
            try {
                const res = await axios.get('https://nodejs-production-b4a4.up.railway.app/usuarios', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsuarios(res.data);

                const meuPerfil = res.data.find(u => u._id === meuId);
                if (meuPerfil) setNickname(meuPerfil.nickname);
            } catch (err) {
                setErro('Erro ao buscar usuários');
            }
        };

        buscarTodos();
    }, [token, navigate]);

    const buscarUsuario = (e) => {
        e.preventDefault();
        setResultado(null);
        setErro('');

        const encontrado = usuarios.find(u =>
            u.nickname && u.nickname.toLowerCase() === busca.toLowerCase()
        );

        if (encontrado) {
            setResultado(encontrado);
        } else {
            setErro('Usuário não encontrado');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 600 }}>
            <h3>Buscar Usuário</h3>
            <p>Bem-vindo, {nickname}</p>

            <form onSubmit={buscarUsuario}>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o nickname do usuário"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        required
                    />
                    <button className="btn btn-primary" type="submit">Buscar</button>
                </div>
            </form>

            {erro && <div className="alert alert-danger">{erro}</div>}

            {resultado && (
                <div className="card mt-3">
                    <div className="card-body">
                        <img src={resultado.avatarUrl} alt="Avatar do usuário" className="rounded-circle" width={64} />
                        <h5 className="card-title">{resultado.nome}</h5>
                        <p className="card-text">
                            <strong>Nickname:</strong> {resultado.nickname}<br />
                            <strong>Email:</strong> {resultado.email}<br />
                            <strong>Idade:</strong> {resultado.idade || 'Não informada'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
