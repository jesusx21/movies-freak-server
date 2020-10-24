const RootPath = require('app-root-path');

const routes = require(`${RootPath}/interfaces/delivery/routes`);

function loadRoutes(server, database) {
  Object.keys(routes)
    .forEach((endpoint) => {
      const [method, path] = endpoint.split(' ');
      const { controller } = routes[endpoint];

      server.route({
        path,
        method,
        handler: async (request, h) => {
          const now = new Date();
          console.log(`${now.toISOString()} - ${method} ${request.url}`);

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

          return h.response(payload).code(statusCode);
        }
      });
    });
}

module.exports = loadRoutes;
