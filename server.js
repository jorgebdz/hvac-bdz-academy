const path = require('path');
const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname),
  prefix: '/',
});

fastify.get('/health', async () => ({ status: 'ok' }));

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

fastify.listen({ port, host }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`HVAC BDZ Academy running at ${address}`);
});
