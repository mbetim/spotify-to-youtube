import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import type { Playlist, SpotifyList } from "../../../types/spotify-api";
import type { SearchListResponse } from "../../../types/youtube-api.js";
import { spotifyApi } from "../../../utils/spotify-api";
import { youtubeApi } from "../../../utils/youtubeApi";
import { prisma } from "../../db/client";
import { protectedProcedure, router } from "../trpc";

const basicToken = Buffer.from(
  `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

const getUserAccessToken = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: { userId },
  });

  if (!account || !account.refresh_token)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You're not authorized",
    });

  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    }),
    {
      headers: {
        Authorization: `Basic ${basicToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return data.access_token;
};

export const spotifyRouter = router({
  search: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        type: z
          .array(
            z.enum([
              "album",
              "artist",
              "playlist",
              "track",
              "show",
              "episode",
              "audiobook",
            ])
          )
          .optional()
          .default(["playlist"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const token = await getUserAccessToken(user.id);

      const queryParams = new URLSearchParams({
        q: input.query,
        type: input.type.join(","),
      });

      try {
        const { data } = await spotifyApi(token).get<{
          playlists: SpotifyList<Playlist>;
        }>(`/search?${queryParams.toString()}`);

        return data;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.response?.data?.error?.message ?? error.message,
        });
      }
    }),
  convertToYoutube: protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const token = await getUserAccessToken(user.id);
      const { data: spotifyData } = await spotifyApi(token).get<Playlist>(
        `/playlists/${input.playlistId}`
      );

      if (!spotifyData.tracks.items && !spotifyData.tracks.items)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Playlist is empty",
        });

      const songsUrl: { song: string; url: string }[] = [];

      await Promise.all(
        spotifyData.tracks.items.map(async (item) => {
          const q = `${item.track.name} ${item.track.artists[0]?.name}`;

          const { data: youtubeData } =
            await youtubeApi.get<SearchListResponse>("/search", {
              params: { q, part: "snippet", maxResults: 1 },
            });

          if (youtubeData.items[0]) {
            songsUrl.push({
              song: item.track.name,
              url: `https://www.youtube.com/watch?v=${youtubeData.items[0].id.videoId}`,
            });
          }

          return youtubeData;
        })
      );

      return songsUrl;
    }),
  getUserPlaylists: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;
    const token = await getUserAccessToken(user.id);
    const { data } = await spotifyApi(token).get("/me/playlists");

    return data as SpotifyList<Playlist>;
  }),
});
