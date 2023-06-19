export const login = (
  req,
  res
) => {
  req.session.user = "toto";
  return res.send("L'utilisateur est connecté en tant que 'toto'");
}