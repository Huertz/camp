module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //! store url that are requesting
    req.session.returnTo = req.originalUrl; // add this line
    req.flash('error', 'Must be signed in');
    return res.redirect('/login');
  }
  next();
};
