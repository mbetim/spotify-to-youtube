import axios from "axios";

export const spotifyApi = (accessToken: string | null) =>
  axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
