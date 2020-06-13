var express = require('express');
var router = express.Router();
var Post = require('../models/Post');


module.exports = {
    lister1: async (req, res, next) => {
        try {
            const findPost = await Post.find();
            res.json(findPost);
        } catch (err) {
            res.json({message: err});
        }

    },

    rech: async (req, res, next) => {
        try {
            const findPostByID = await Post.findById(req.params.id);
            res.json(findPostByID);
        } catch (err) {
            res.json({message: err});
        }

    },
    delete: async (req, res, next) => {
        try {
            const findPostByID = await Post.remove({_id: req.params.id});
            res.json(findPostByID);
        } catch (err) {
            res.json({message: err});
        }
    },
    create: async (req, res, next) => {
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId
        })
        const cre = await post.save();
        res.json(cre);
    }
}
