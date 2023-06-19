export const isAuthenticated = (req, res, next) => {
  if(!req.session.user) {
    return res.status(403).send("Vous devez être connecter pour acceder à cette requête");
  }

  next();
}