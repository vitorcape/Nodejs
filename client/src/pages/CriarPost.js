import React, { useState } from 'react';
import axios from 'axios';

function CriarPost() {
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post('https://nodejs-production-b4a4.up.railway.app/posts', {
                titulo,
                conteudo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMensagem('Post criado com sucesso!');
            setTitulo('');
            setConteudo('');
        } catch (err) {
            setMensagem('Erro ao criar post');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Novo Post</h3>
            {mensagem && <div className="alert alert-info">{mensagem}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Título</label>
                    <input className="form-control" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Conteúdo</label>
                    <textarea className="form-control" value={conteudo} onChange={(e) => setConteudo(e.target.value)} required />
                </div>
                <button className="btn btn-primary">Publicar</button>
            </form>
        </div>
    );
}

export default CriarPost;