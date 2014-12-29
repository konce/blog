var crypto = require('crypto'),
    User = require('../model/user.js'),
    Helper = require('../helper/RouterHelper');

module.exports = function(app) {
    app.get('/login', Helper.checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', Helper.checkNotLogin);
    app.post('/login', function (req, res) {
        // create password with md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        // check user existence
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登录成功');
            res.redirect('/');
        });
    });
    app.get('/logout', Helper.checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });
};
