"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['https://emilianipizzas.com/', 'http://localhost:3000', 'https://bira-backend-production.up.railway.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on https://l4valink-production.up.railway.app`);
}
bootstrap();
//# sourceMappingURL=main.js.map