const Post = require('../models/Post');

exports.criarPost = async (req, res) => {
    const { titulo, conteudo } = req.body;
    const { id, email } = req.user;

    try {
        const novoPost = await Post.create({
            titulo,
            conteudo,
            autor: { id, email }
        });
        res.status(201).json(novoPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.buscarPosts = async (req, res) => {
    const filtro = req.query.titulo;
    try {
        const posts = filtro
            ? await Post.find({ titulo: new RegExp(filtro, 'i') })
            : await Post.find().sort({ dataCriacao: -1 });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};