import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Content Management Backend API')
    .setDescription(
      'API documentation for the NestJS Content Management backend. ' +
        'Use this to explore endpoints, request/response schemas, and test the API. ' +
        'Use the base API URL as https://localhost:3000',
    )
    .setVersion('1.0')
    .setTermsOfService('https://your-domain.com/terms')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Local development server')
    .addServer('https://api.yourdomain.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
