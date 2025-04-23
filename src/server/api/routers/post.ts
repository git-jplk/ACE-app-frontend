import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Mocked DB
interface Post {
  id: number;
  name: string;
}
const posts: Post[] = [
  {
    id: 1,
    name: "Hello World",
  },
];



export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      posts.push(post);
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),
});

export const analysisRouter = createTRPCRouter({
  chat: publicProcedure
    .input(z.object({ message: z.string(), context: z.record(z.string(), z.any()) }))
    .mutation(async ({ input }) => {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.message, context: input.context }),
      });
      return response.json();
    }),

  analyze: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      // Simulate a long-running task
      const response = await fetch("http://localhost:5000/start-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: input.message }),
      });

      return response.json();
    }),
});
