import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: process.env.FrontendHost,
		credentials: true
	});
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted:true,
	}));
	// app.use(cookieParser(process.env.cookie_secret));
	app.use(cookieParser());
	await app.listen(8000);
}
bootstrap();
