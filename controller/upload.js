var Post = require('../model/post.js'),
    Helper = require('../helper/RouterHelper');

module.exports = function(app) {
    app.get('/upload', Helper.checkLogin);
    app.get('/upload', function (req, res) {
        res.render('upload', {
            title: '文件上传',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/upload', Helper.checkLogin);
    app.post('/upload', function (req, res) {
        req.flash('success', '文件上传成功!');
        res.redirect('/upload');
    });
};
