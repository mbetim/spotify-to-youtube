import axios from "axios";
import { env } from "../env/server.mjs";

export const youtubeApi = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3",
  params: {
    key: env.YOUTUBE_KEY,
  },
});
