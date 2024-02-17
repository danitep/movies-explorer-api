class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = process.env.STATUS_NOT_FOUND;
  }
}

module.exports = NotFound;
