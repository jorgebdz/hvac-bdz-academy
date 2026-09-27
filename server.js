const path = require('path');
const fastify = require('fastify')({ logger: true });

fastify.get('/health', async () => ({ status: 'ok' }));

// Backward-compatible redirects for the first public version of the portal.
// Some browsers may still have the old PDF links cached.
fastify.get('/docs/Cuadernillo_Participante_M1_Historia_Fundamentos_HVAC_BDZ_2026.pdf', async (request, reply) => {
  return reply.redirect(302, '/docs/cuadernillo-m1.html');
});

fastify.get('/docs/Presentacion_M1_Historia_Fundamentos_HVAC_BDZ_2026.pdf', async (request, reply) => {
  return reply.redirect(302, '/docs/presentacion-m1.html');
});

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname),
  prefix: '/',
});

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

fastify.listen({ port, host }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`HVAC BDZ Academy running at ${address}`);
});
