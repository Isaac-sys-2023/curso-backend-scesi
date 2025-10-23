export default function roles(allowed = []){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ msg: 'No autenticado' });
    if(allowed.length === 0) return next(); // ruta pública si se llama sin roles
    if(allowed.includes(req.user.rol) || req.user.rol === 'admin') return next();
    return res.status(403).json({ msg: 'Acceso denegado' });
  }
}