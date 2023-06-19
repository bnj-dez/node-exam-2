export const login = (
  req,
  res
) => {
  try {
    req.session.user = 'toto';
    return res.send('toto');
  } catch (error) {
    return res.status(500).send("Une erreur s'est produite lors de la récupération des livres");
  }
}