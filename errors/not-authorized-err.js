class UnautorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = process.env.STATUS_UNAUTHORIZED;
  }
}

module.exports = UnautorizedError;
