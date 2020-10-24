const RootPath = require('app-root-path');

const routes = require(`${RootPath}/interfaces/delivery/routes`);

function loadRoutes(server, database) {
  Object.keys(routes)
    .forEach((endpoint) => {
      const [method, path] = endpoint.split(' ');
      const { controller, payloadSchema } = routes[endpoint];

      server.route({
        path,
        method,
        handler: buildHandler(method, database, controller),
        options: buildOptions(payloadSchema)
      });
    });
}

function buildHandler(method, database, controller) {
  return async (request, h) => {
    const now = new Date();

    request.database = database;
    let payload;
    let statusCode;

    h.payload = (value) => {
      payload = value;

      return h;
    }

    h.statusCode = (value) => {
      statusCode = value;

      return h;
    }

    await controller(request, h);

    console.log(`${now.toISOString()} - ${method} ${request.url} - ${statusCode}`);
    return h.response(payload).code(statusCode);
  }
}

function buildOptions(payloadSchema) {
  if (!payloadSchema) return {};

  const options = {
    validate: {
      payload: payloadSchema
    }
  };

  return options;
}

module.exports = loadRoutes;
