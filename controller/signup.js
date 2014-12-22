var Helper = require('../helper/RouterHelper');

module.exports = function(app) {
    app.get('/signup', Helper.checkNotLogin);
    app.get('/signup', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/signup', Helper.checkNotLogin);
    app.post('/signup', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];

        // 检查两次密码输入是否一致
        if (password_re !== password) {
            req.flash('error', '两次密码输入不一致');
            return res.redirect('/signup');
        }

        // 生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');

        var newUser = new User({
            name: name,
            password: password,
            email: req.body.email
        });

        // 检查用户名是否已经存在
        User.get(newUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            if (user) {
                req.flash('error', '用户已存在')
                return res.redirect('/signup');
            }

            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/signup');
                }
                req.session.user = user;
                req.flash('success', '注册成功');
                res.redirect('/');
            });
        });
    });
};
