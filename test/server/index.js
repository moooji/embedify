'use strict';

const express = require('express');

const server = function server(port) {
  const app = express();

  app.get('/status/:code', (req, res) => {
    const statusCode = req.params.code;

    return res.status(statusCode).
      json({ error: statusCode });
  });

  return app.listen(port);
};

module.exports = server;
