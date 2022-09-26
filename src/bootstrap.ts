import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CrudRequestInterceptor } from "@nestjsx/crud";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { NestExpressApplication } from "@nestjs/platform-express";
import { UserRequestInterceptor } from "interceptors";

dotenv.config();

const env = process.env;

const PORT = env.PORT || 3000;

export async function bootstrap(
  module,
  beforeStartHandler?: (app: NestExpressApplication) => void
): Promise<NestExpressApplication> {
  const logger = new Logger(env.SERVICE || "Service");

  const app = await NestFactory.create<NestExpressApplication>(module);

  if (beforeStartHandler) {
    beforeStartHandler(app);
  }

  app.use(cookieParser());
  app.useGlobalInterceptors(new CrudRequestInterceptor());
  app.useGlobalInterceptors(new UserRequestInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle(env.SERVICE || "Service")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(PORT);

  logger.log(`Application started on port ${PORT}`);

  return app;
}
