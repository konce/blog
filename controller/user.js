var Post = require('../model/post.js'),
User = require('../model/user.js'),
Helper = require('../helper/RouterHelper');

module.exports = function(app) {
    // 检查用户
    app.get('/u/:name', function (req, res) {
        User.get(req.params.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('/');
            }

            // 查询并且返回所有文章
            Post.getAll(user.name, function (err, posts) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('user', {
                    title: user.name,
                    posts: posts,
                    user: req.session.user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
    });

    app.get('/u/:name/:day/:title', function (req, res) {
        Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('article', {
                title: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
};
