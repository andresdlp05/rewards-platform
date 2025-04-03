import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Crear una instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global para todas las rutas
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no esperadas
    transform: true, // Transforma automáticamente los tipos
    forbidNonWhitelisted: true, // Arroja error si hay propiedades no esperadas
  }));

  // Configurar Swagger para documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Sistema de Recompensas Gamificadas')
    .setDescription('API para gestionar usuarios, logros y recompensas')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Iniciar el servidor en el puerto 3000
  await app.listen(3000);
  console.log(`La aplicación está corriendo en: ${await app.getUrl()}`);
}
bootstrap();