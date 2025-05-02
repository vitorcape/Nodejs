import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let userId = '';

  try {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  } catch {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErro('');

    if (novaSenha !== confirmar) {
      return setErro('As senhas não coincidem');
    }

    try {
      await axios.put(`https://nodejs-production-b4a4.up.railway.app/usuarios/${userId}/senha`, {
        senhaAtual,
        novaSenha
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMsg('Senha atualizada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmar('');
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao atualizar senha');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h3>Alterar Senha</h3>
      {msg && <div className="alert alert-success">{msg}</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Senha Atual</label>
          <input type="password" className="form-control" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nova Senha</label>
          <input type="password" className="form-control" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar Nova Senha</label>
          <input type="password" className="form-control" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Atualizar Senha</button>
      </form>
    </div>
  );
}

export default AlterarSenha;