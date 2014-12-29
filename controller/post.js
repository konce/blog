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
            post = new Post(curUser.name, req.body.title, req.body.post, req.body.summary);

        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/'); //发表成功跳转到主页
        });
    });

    app.get('/edit/:name/:day/:title', Helper.checkLogin);
    app.get('/edit/:name/:day/:title', function (req, res) {
        var curUser = req.session.user;
        Post.edit(curUser.name, req.params.day, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            res.render('edit', {
                title: '编辑',
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.post('/edit/:name/:day/:title', Helper.checkLogin);
    app.post('/edit/:name/:day/:title', function (req, res) {
        var curUser = req.session.user;
        Post.update(curUser.name, req.params.day, req.params.title, req.body.post, function (err) {
            var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
            if (err) {
                req.flash('error', err);
                return res.redirect(url);
            }
            req.flash('success', '修改成功');
            res.redirect(url);
        });
    });

    app.get('/remove/:name/:day/:title', Helper.checkLogin);
    app.get('/remove/:name/:day/:title', function (req, res) {
        var currentUser = req.session.user;
        Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            res.redirect('/');
        });
    });
};
