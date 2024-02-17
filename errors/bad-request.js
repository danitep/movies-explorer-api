class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = process.env.STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequest;
