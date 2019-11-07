import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import * as dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3000;
declare const module: any;
var whitelist = ['http://localhost:3030, http://localhost:3000, https://petsoredemo.azurewebsites.net/graphql']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({...corsOptions});

  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  Logger.log(`🚀 Server running on http://localhost:${port}/graphql `, 'Bootstrap');
}
bootstrap();