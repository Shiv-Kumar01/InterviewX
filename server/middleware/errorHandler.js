// Central error handler: one place decides what the client is allowed to see.
export default function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Something went wrong on our side. Please try again.';

  if (err.code === 11000) { status = 409; message = 'An account with this email already exists.'; }
  if (err.type === 'entity.parse.failed') { status = 400; message = 'Request body is not valid JSON.'; }

  if (status >= 500) console.error(err); // full details stay in the server log only
  res.status(status).json({ message });
}
