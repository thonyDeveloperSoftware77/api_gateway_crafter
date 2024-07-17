import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('--- Middleware de proxy invocado ---');
    console.log('URL de la solicitud:', req.url);
    console.log('Método de la solicitud:', req.method);
    console.log('Headers de la solicitud:', req.headers);

    // Verificar si la solicitud es un POST a /users
    if (req.method === 'POST' && req.url === '/users') {
      console.log('Solicitud POST a /users detectada, no se redirige al microservicio');
      return next();
    }

    // Definir el mapa de servicios
    const serviceMap = {
      'careers': 'http://localhost:6052/careers',
      'faculties': 'http://localhost:6052/faculties',
      'skills': 'http://localhost:6052/skills',
      'users': 'http://localhost:6052/users',
      'users-careers': 'http://localhost:6052/users-careers',
      'users-skills': 'http://localhost:6052/users-skills',
    };

    const serviceName = req.url.split('/')[1];
    const serviceUrl = serviceMap[serviceName];

    console.log(`Service name: ${serviceName}`);
    console.log(`Service URL: ${serviceUrl}`);

    if (serviceUrl) {
      const proxy = createProxyMiddleware({
        target: serviceUrl,
        ignorePath: true,
        on: {
          proxyReq: fixRequestBody,
        },
        changeOrigin: true,

      });

      // Agregar log antes de invocar el proxy
      console.log(`Redirigiendo la solicitud a: ${serviceUrl}`);
      proxy(req, res, next);
    } else {
      console.log('Servicio no encontrado para:', serviceName);
      next();
    }
  }
}
