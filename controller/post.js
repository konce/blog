var Post = require('../model/post.js'),
    Helper = require('../helper/RouterHelper');

module.exports = function(app) {
    app.get('/post', Helper.checkLogin);
    app.get('/post', function (req, res) {
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/post', Helper.checkLogin);
    app.post('/post', function (req, res) {
        var curUser = req.session.user,
            post = new Post(curUser.name, req.body.title, req.body.post);

        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/'); //发表成功跳转到主页
        });
    });
};
