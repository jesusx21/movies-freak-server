function health(request, h) {
  return h.payload('Don\'t worry, I\'m alive').statusCode(200);
}

module.exports = health;
