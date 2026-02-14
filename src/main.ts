import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    // Enable CORS for frontendd
    app.enableCors({
        origin: ['https://emilianipizzas.com', 'http://localhost:3000', 'https://bira-backend-production.up.railway.app','https://www.emilianipizzas.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on https://l4valink-production.up.railway.app`);
}
bootstrap();
