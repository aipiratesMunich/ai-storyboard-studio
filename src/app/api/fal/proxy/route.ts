import { createRouteHandler } from "@fal-ai/server-proxy/nextjs";

export const { GET, POST, PUT } = createRouteHandler({
  resolveFalAuth: async () => {
    return `Key ${process.env.FAL_KEY}`;
  },
});
