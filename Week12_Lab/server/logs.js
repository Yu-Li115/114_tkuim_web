export function logMiddleware(req, res, next) {
  const user = req.user?.email || 'guest';
  console.log(`[${new Date().toISOString()}] ${user} ${req.method} ${req.originalUrl}`);
  next();
}
