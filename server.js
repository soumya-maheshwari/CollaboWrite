import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`server listening at ${PORT}`));
