import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [nome, setNome] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setErro('');
        setMensagem('');

        try {
            await axios.post('https://nodejs-production-b4a4.up.railway.app/auth/register', {
                nome,
                nickname,
                email,
                senha
            });

            setMensagem('Cadastro realizado com sucesso! Faça login.');
            setNome('');
            setNickname('');
            setEmail('');
            setSenha('');
        } catch (err) {
            setErro(err.response?.data?.error || 'Erro ao cadastrar');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h3 className="mb-3">Cadastrar</h3>
            {mensagem && <div className="alert alert-success">{mensagem}</div>}
            {erro && <div className="alert alert-danger">{erro}</div>}
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Nome:</label>
                    <input type="text" className="form-control" value={nome}
                        onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nickname:</label>
                    <input type="text" className="form-control" value={nickname}
                        onChange={(e) => setNickname(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="email" className="form-control" value={email}
                        onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Senha:</label>
                    <input type="password" className="form-control" value={senha}
                        onChange={(e) => setSenha(e.target.value)} required />
                </div>
                <button className="btn btn-success w-100" type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default Register;