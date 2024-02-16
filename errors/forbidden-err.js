class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = process.env.STATUS_FORBIDDEN;
  }
}

module.exports = Forbidden;
