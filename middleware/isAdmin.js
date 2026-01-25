//middleware for checking is customer admin
const isAdmin = (req,res,next) => {
   if (req.session.customer && req.session.customer.isAdmin) {
     return next();
   };
   return res.redirect("/login");
};

module.exports = isAdmin;