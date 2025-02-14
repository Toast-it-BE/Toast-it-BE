const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}]`, err);

  const statusCode = err.statusCode || 500;

  if (err.name === 'ValidationError' && err.errors) {
    return res.status(422).json({
      error: err.name,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: err.name,
      message: '인증 토큰이 유효하지 않습니다.',
    });
  }

  return res.status(statusCode).json({
    error: err.name,
    message: err.message,
  });
};

module.exports = errorHandler;
