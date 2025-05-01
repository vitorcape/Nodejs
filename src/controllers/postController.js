const Post = require('../models/Post');
const Counter = require('../models/Counter');

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

exports.criarPost = async (req, res) => {
    const { titulo, conteudo } = req.body;
    const { id, nome, nickname, email } = req.user;

    try {
        let counter = await Counter.findOneAndUpdate(
            { nome: 'post' },
            { $inc: { valor: 1 } },
            { new: true, upsert: true }
        );

        const novoPost = await Post.create({
            numero: counter.valor, // número sequencial
            titulo,
            conteudo,
            autor: { id, nome, nickname, email }
        });

        res.status(201).json(novoPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editarPost = async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;
    const { id: userId } = req.user;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: 'Post não encontrado' });

        if (post.autor.id !== userId) return res.status(403).json({ error: 'Acesso negado' });

        post.titulo = titulo;
        post.conteudo = conteudo;
        await post.save();

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.excluirPost = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: 'Post não encontrado' });

        if (post.autor.id !== userId) return res.status(403).json({ error: 'Acesso negado' });

        await post.deleteOne();
        res.json({ mensagem: 'Post excluído com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
