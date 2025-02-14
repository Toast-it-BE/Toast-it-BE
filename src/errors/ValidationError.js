class ValidationError extends Error {
  constructor(message, statusCode = 422) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

module.exports = ValidationError;
