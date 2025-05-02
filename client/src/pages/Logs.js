import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Logs() {
    const [logs, setLogs] = useState([]);
    const [erro, setErro] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                navigate('/dashboard');
                return;
            }
        } catch {
            navigate('/login');
            return;
        }

        const buscarLogs = async () => {
            try {
                const res = await axios.get('https://nodejs-production-b4a4.up.railway.app/logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(res.data);
            } catch (err) {
                setErro('Erro ao buscar logs');
            }
        };

        buscarLogs();
    }, [token, navigate]);

    return (
        <div className="container mt-4">
            <h3>Logs de Auditoria</h3>
            {erro && <div className="alert alert-danger">{erro}</div>}
            {logs.length === 0 ? (
                <p>Nenhum log encontrado.</p>
            ) : (
                <table className="table table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>Ação</th>
                            <th>Feita por</th>
                            <th>Sobre</th>
                            <th>Data/Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log._id}>
                                <td>{log.acao}</td>
                                <td>{log.autor.email}</td>
                                <td>{log.alvo?.email || 'N/A'}</td>
                                <td>{new Date(log.data).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Logs;