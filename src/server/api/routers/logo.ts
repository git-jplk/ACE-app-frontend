// src/server/router/logo.ts
import { z } from 'zod';
import fetch from 'node-fetch';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const logoRouter = createTRPCRouter({
  fetchLogo: publicProcedure
    .input(z.object({ companyName: z.string().min(1) }))
    .query(async ({ input }) => {
      const name = input.companyName.trim();

      // 1) Try Clearbit Autocomplete (no API key needed)
      const cbUrl = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(name)}`;
      const cbRes = await fetch(cbUrl);
      if (!cbRes.ok) {
        throw new TRPCError({ code: 'BAD_GATEWAY', message: 'Clearbit request failed' });
      }
      const suggestions = (await cbRes.json()) as Array<{ logo?: string }>;
      if (suggestions?.length > 0 && suggestions[0]?.logo) {
        return { logoUrl: suggestions[0]?.logo ?? '' };
      }

      // 2) Fallback to DuckDuckGo Image Search (no API key needed)
      const ddgEndpoint = `https://duckduckgo.com/i.js?l=en-us&q=${encodeURIComponent(name + ' logo')}`;
      let ddgRes;
      try {
        ddgRes = await fetch(ddgEndpoint, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)' }
        });
      } catch (error) {
        throw new TRPCError({ code: 'BAD_GATEWAY', message: 'DuckDuckGo request failed' });
      }
      if (!ddgRes.ok) {
        throw new TRPCError({ code: 'BAD_GATEWAY', message: 'DuckDuckGo request failed' });
      }
      const ddgData = (await ddgRes.json()) as any;
      const results = ddgData.results as Array<{ image: string }>;
      if (!results || results.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: `No logo found for "${name}"` });
      }

      // Return the first image result
      return { logoUrl: results[0]?.image ?? '' };
    }),
});
