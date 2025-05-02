import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const [usuarios, setUsuarios] = useState([]);
    const [erro, setErro] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [editando, setEditando] = useState(null); // usuário em edição
    const [formEdit, setFormEdit] = useState({ nome: '', email: '', idade: '', telefone: '' });
    const [loginLogs, setLoginLogs] = useState([]);

    useEffect(() => {
        if (!token) return navigate('/login');

        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') {
            return navigate('/dashboard');
        }

        const buscarUsuarios = async () => {
            try {
                const res = await axios.get('https://nodejs-production-b4a4.up.railway.app/usuarios', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsuarios(res.data);
            } catch (err) {
                setErro('Erro ao buscar usuários');
            }
        };

        buscarUsuarios();

        const buscarLoginLogs = async () => {
            try {
                const res = await axios.get('https://nodejs-production-b4a4.up.railway.app/login-logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLoginLogs(res.data);
            } catch (err) {
                console.error('Erro ao buscar logs de login');
            }
        };

        buscarLoginLogs();

    }, [token, navigate]);

    const promover = async (id) => {
        try {
            await axios.put(`https://nodejs-production-b4a4.up.railway.app/usuarios/${id}/promover`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios((prev) =>
                prev.map((u) => (u._id === id ? { ...u, role: 'admin' } : u))
            );
        } catch (err) {
            alert('Erro ao promover usuário');
        }
    };

    const deletar = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            await axios.delete(`https://nodejs-production-b4a4.up.railway.app/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(usuarios.filter(u => u._id !== id));
        } catch (err) {
            alert('Erro ao deletar usuário');
        }
    };

    const iniciarEdicao = (usuario) => {
        setEditando(usuario._id);
        setFormEdit({
            nome: usuario.nome,
            email: usuario.email,
            idade: usuario.idade || '',
            telefone: usuario.telefone || ''
        });
    };

    const cancelarEdicao = () => {
        setEditando(null);
    };

    const salvarEdicao = async (id) => {
        try {
            await axios.put(`https://nodejs-production-b4a4.up.railway.app/usuarios/${id}`, formEdit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios((prev) =>
                prev.map((u) => (u._id === id ? { ...u, ...formEdit } : u))
            );
            setEditando(null);
        } catch (err) {
            alert('Erro ao salvar alterações');
        }
    };

    const handleEditChange = (e) => {
        setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-4">
            <h3>Painel Administrativo</h3>
            {erro && <div className="alert alert-danger">{erro}</div>}
            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Nickname</th>
                        <th>Email</th>
                        <th>Idade</th>
                        <th>Função</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario._id}>
                            <td>
                                {editando === usuario._id ? (
                                    <input className="form-control" name="nome" value={formEdit.nome} onChange={handleEditChange} />
                                ) : (
                                    usuario.nome
                                )}
                            </td>
                            <td>
                                {editando === usuario._id ? (
                                    <input className="form-control" name="nickname" value={formEdit.nickname} onChange={handleEditChange} />
                                ) : (
                                    usuario.nickname
                                )}
                            </td>
                            <td>
                                {editando === usuario._id ? (
                                    <input className="form-control" name="email" value={formEdit.email} onChange={handleEditChange} />
                                ) : (
                                    usuario.email
                                )}
                            </td>
                            <td>
                                {editando === usuario._id ? (
                                    <input className="form-control" name="idade" value={formEdit.idade} onChange={handleEditChange} />
                                ) : (
                                    usuario.idade || '-'
                                )}
                            </td>
                            <td>
                                {editando === usuario._id ? (
                                    <input className="form-control" name="telefone" value={formEdit.telefone} onChange={handleEditChange} />
                                ) : (
                                    usuario.telefone || '-'
                                )}
                            </td>
                            <td>
                                {editando === usuario._id ? (
                                    <>
                                        <button className="btn btn-sm btn-success me-2" onClick={() => salvarEdicao(usuario._id)}>Salvar</button>
                                        <button className="btn btn-sm btn-secondary" onClick={cancelarEdicao}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        {usuario.role !== 'admin' && (
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => promover(usuario._id)}>
                                                Promover
                                            </button>
                                        )}
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => iniciarEdicao(usuario)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deletar(usuario._id)}>
                                            Excluir
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h4 className="mt-5">Histórico de Login</h4>
            <table className="table table-sm table-bordered mt-2">
                <thead>
                    <tr>
                        <th>Usuário</th>
                        <th>Email</th>
                        <th>IP</th>
                        <th>Navegador</th>
                        <th>Data/Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {loginLogs.map(log => (
                        <tr key={log._id}>
                            <td>{log.usuario?.id}</td>
                            <td>{log.usuario?.email}</td>
                            <td>{log.ip || 'N/A'}</td>
                            <td>{log.userAgent?.slice(0, 60)}</td>
                            <td>{new Date(log.data).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default AdminPanel;