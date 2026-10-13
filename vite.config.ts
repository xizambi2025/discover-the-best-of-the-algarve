import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleStayApi } from "./api/_lib/stay.mjs";

function stayApi(): Plugin {
  return {
    name: "stay-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/")) {
          next();
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        req.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let body: unknown = null;
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              body = null;
            }
          }
          void handleStayApi({
            method: req.method ?? "GET",
            path: url.split("?")[0],
            cookie: typeof req.headers.cookie === "string" ? req.headers.cookie : null,
            body,
            secure: false,
          })
            .then((result) => {
              res.statusCode = result.status;
              for (const [name, value] of Object.entries(result.headers)) res.setHeader(name, value);
              if (result.body == null) res.end();
              else res.end(JSON.stringify(result.body));
            })
            .catch((error: unknown) => {
              console.error(error);
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, code: "send" }));
            });
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);
  return {
    plugins: [react(), stayApi()],
  };
});
