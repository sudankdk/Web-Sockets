import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const PORT = 443;
const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

import { state } from "./models/state.js";
import { json } from "stream/consumers";

wss.on("connection", (ws) => {
  console.log("new client connected");
  ws.on("message", (message) => {
    console.log(message);
    try {
      const data = JSON.parse(message);
      if (data.message === "fetch") {
        const ledState = state[0];
        ws.send(JSON.stringify(ledState));
      } else if (data.message === "update") {
        state[0] = {
          name: "LED",
          state: data.state,
        };

        wss.clients.forEach((client) => {
          client.send(JSON.stringify(state[0]));
        });
      } else {
        ws.send(
          JSON.stringify({
            message: "command not found",
          })
        );
      }
    } catch (error) {
      console.error(error);
      ws.send(
        JSON.stringify({
          message: error.message,
        })
      );
    }
  });
});

app.get("/", (req, res) => {
  //   res.send("Hello World");
  res.json({ message: "Hello " });
});

server.listen(PORT, () => {
  console.log(" the server running on port 443");
});
