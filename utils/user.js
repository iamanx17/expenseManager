exports.is_authenticated = (req, res, next) => {
  if (!req.session.isLoggedin) {
    return res.render("login.njk", {
      message: "You need to login to access this page",
    });
  }
  next();
};
