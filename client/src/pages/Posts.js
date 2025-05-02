import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [busca, setBusca] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [novoTitulo, setNovoTitulo] = useState('');
    const [novoConteudo, setNovoConteudo] = useState('');
    const [idLogado, setIdLogado] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setIdLogado(decoded.id);
        }
        carregarPosts();
    }, []);

    const carregarPosts = async (filtro = '') => {
        try {
            const res = await axios.get('https://nodejs-production-b4a4.up.railway.app/posts');
            const todos = res.data;

            if (!filtro) {
                setPosts(todos);
                return;
            }

            const filtroLower = filtro.toLowerCase();
            const filtrados = todos.filter(post =>
                post.titulo?.toLowerCase().includes(filtroLower) ||
                post.autor?.nome?.toLowerCase().includes(filtroLower)
            );

            setPosts(filtrados);
        } catch (err) {
            alert('Erro ao buscar posts');
        }
    };

    const handleBusca = (e) => {
        e.preventDefault();
        carregarPosts(busca);
    };

    const iniciarEdicao = (post) => {
        setEditandoId(post._id);
        setNovoTitulo(post.titulo);
        setNovoConteudo(post.conteudo);
    };

    const salvarEdicao = async (id) => {
        try {
            await axios.put(`https://nodejs-production-b4a4.up.railway.app/posts/${id}`, {
                titulo: novoTitulo,
                conteudo: novoConteudo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditandoId(null);
            carregarPosts();
        } catch (err) {
            alert('Erro ao editar post');
        }
    };

    const excluirPost = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
        try {
            await axios.delete(`https://nodejs-production-b4a4.up.railway.app/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            carregarPosts();
        } catch (err) {
            alert('Erro ao excluir post');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Posts</h3>
            <form onSubmit={handleBusca} className="mb-3">
                <input
                    className="form-control"
                    placeholder="Buscar por título ou autor"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </form>

            {posts.map(post => (
                <div key={post._id} className="card mb-3">
                    <div className="card-body">
                        {editandoId === post._id ? (
                            <>
                                <input className="form-control mb-2" value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} />
                                <textarea className="form-control mb-2" value={novoConteudo} onChange={(e) => setNovoConteudo(e.target.value)} />
                                <button className="btn btn-success btn-sm me-2" onClick={() => salvarEdicao(post._id)}>Salvar</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setEditandoId(null)}>Cancelar</button>
                            </>
                        ) : (
                            <>
                                <h5>{post.titulo}</h5>
                                <p>{post.conteudo}</p>
                                <small className='text-muted'><img src={post.autor?.avatarUrl} alt="Avatar" width={24} className="rounded-circle me-1" />
                                    Autor: {post.autor?.nome} / Post: {post.numero} / {new Date(post.dataCriacao).toLocaleString()}</small>
                                {post.autor?.id === idLogado && (
                                    <div className="mt-2">
                                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => iniciarEdicao(post)}>Editar</button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => excluirPost(post._id)}>Excluir</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Posts;