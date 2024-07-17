import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';

@Injectable()
export class ConditionalBodyParserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const url = req.url.split('?')[0]; // Remover query params si existen
    if (
      (req.method === 'POST' && (url === '/users' || url === '/student/skills'
        || url === '/comparation/careers' || url === '/comparation/skills'))
    ) {
      console.log('Body parser aplicado para la ruta:', url);
      bodyParser.json()(req, res, () => {
        console.log('Cuerpo de la solicitud después de body-parser:', req.body);
        next();
      });
    }else if (
      (req.method === 'DELETE' && url === '/student/skills')
    ){
      console.log('Body parser aplicado para la ruta:', url);
      bodyParser.json()(req, res, () => {
        console.log('Cuerpo de la solicitud después de body-parser:', req.body);
        next();
      });
    }else
     {
      next();
    }
  }
}
