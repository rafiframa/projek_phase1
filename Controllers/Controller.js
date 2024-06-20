let User = require(`../models`).User
let Post = require(`../models`).Post
let PostTag = require(`../models`).PostTag
let Tag = require(`../models`).Tag
var bcrypt = require('bcryptjs');

class Controller {
    static async showLandingPage(req, res) {
        try {
            res.render("LandingPage")
        } catch (err) {
            res.send(err)
        }
    }

    static async showRegister(req, res) {
        try {
            let error = req.query.error
            res.render("Register", { error })
        } catch (err) {
            res.send(err)
        }
    }

    static async showLogin(req, res) {
        try {
            let error = req.query.error
            res.render("Login", { error })
        } catch (err) {
            res.send(err)
        }
    }

    static async postRegister(req, res) {
        try {
            let { username, email, password, role } = req.body
            let create = await User.create(req.body)
            res.redirect(`/login`)
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                res.redirect(`/register?error=Choose+role+between+"admin"+or+"user"`)
            } else {
                res.send(err)
            }
            
        }
    }

    static async postLogin(req, res) {
        try {
            let userInstance = await User.findOne({ where: { username: req.body.username } });
            if (userInstance) {
                if (bcrypt.compareSync(req.body.password, userInstance.password)) {

                    req.session.user = {
                        id: userInstance.id,
                        username: userInstance.username,
                        email: userInstance.email,
                        role: userInstance.role
                    };
                    res.redirect('/home');
                } else {
                    res.redirect(`/login?error=Wrong+Username+or+Password`);
                }
            } else {
                res.redirect(`/login?error=Wrong+Username+or+Password`);
            }
        } catch (err) {
            res.send(err);
        }
    }


    static async showHome(req, res) {
        try {
            if (!req.session.user) {
                res.redirect(`/login`)
            }
            const posts = await Post.findAll({
                include: [
                    {
                        model: User,
                    },
                    {
                        model: PostTag,
                        include: [
                            {
                                model: Tag,
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']]
            })
            res.render("Home", { posts })
        } catch (err) {
            res.send(err)
        }
    }

    static async addTweet(req, res) {
        try {
            res.render("AddTweet")
        } catch (err) {
            res.send(err)
        }
    }

    static async postTweet(req, res) {
        try {
            let UsersId = req.session.user.id
            let content = req.body.content
            let image;
            if (req.file) {
                image = `${req.file.filename}`;
            } else {
                image = null;
            }


            let create = await Post.create({ UsersId, content, image})
            res.redirect(`home`)
        } catch (err) {
            res.send(err)
        }
    }
}
module.exports = Controller