import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/index.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL não está definida no arquivo .env");
}

const connectionUrl = new URL(databaseUrl);

if (connectionUrl.protocol !== "mysql:") {
	throw new Error("DATABASE_URL precisa começar com mysql://");
}

const database = decodeURIComponent(connectionUrl.pathname.replace(/^\//, ""));

if (!database) {
	throw new Error("DATABASE_URL precisa informar o nome do banco de dados");
}

const adapter = new PrismaMariaDb({
	host: connectionUrl.hostname,
	port: Number(connectionUrl.port || 3306),
	user: decodeURIComponent(connectionUrl.username),
	password: decodeURIComponent(connectionUrl.password),
	database,
});

const prisma = new PrismaClient({ adapter });

export default prisma;