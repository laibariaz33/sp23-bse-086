module.exports = async function (req, res, next) {
    if (!req.session.userId) return res.redirect("/login");
    else next();
  };