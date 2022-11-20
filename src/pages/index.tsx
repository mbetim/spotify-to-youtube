import { Field, Form, Formik } from "formik";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDialog } from "../components/dialog";
import { UrlsListDialog } from "../components/UrlsListDialog";
import { PlaylistItem } from "../components/PlaylistItem";
import type { Playlist } from "../types/spotify-api";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const router = useRouter();
  const urlsListDialog = useDialog<{ song: string; url: string }[]>();

  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const generateMutation = trpc.spotify.convertToYoutube.useMutation();
  const { data, isLoading } = trpc.spotify.search.useQuery(
    { query: searchTerm ?? "" },
    {
      enabled: searchTerm !== null,
      onError: ({ data, message }) => {
        if (data?.code === "UNAUTHORIZED")
          return router.replace("/api/auth/login");

        console.log(message);
      },
    }
  );

  const handleCardClick = async (playlist: Playlist) => {
    try {
      const response = await generateMutation.mutateAsync({
        playlistId: playlist.id,
      });

      urlsListDialog.open(response);
    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Spotify to YouTube</title>
        <meta
          name="description"
          content="Search for songs on YouTube from Spotify"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto min-h-screen p-4">
        <h1 className="text-xl">Spotify to YouTube</h1>

        <Formik
          initialValues={{ search: "" }}
          onSubmit={(data) => setSearchTerm(data.search)}
        >
          {() => (
            <Form className="flex gap-2">
              <Field
                name="search"
                className="w-full flex-1 rounded-lg border border-gray-200 px-4 py-2 pr-12 text-sm shadow-sm"
                required
                placeholder="Enter your search query..."
              />

              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm shadow-sm"
              >
                Search
              </button>
            </Form>
          )}
        </Formik>

        {isLoading && searchTerm !== null ? <h2>Loading...</h2> : null}

        {data?.playlists && data?.playlists?.items.length > 0 && (
          <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.playlists.items.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
                onClick={() => handleCardClick(playlist)}
              />
            ))}
          </ul>
        )}
      </main>

      <UrlsListDialog
        isOpen={urlsListDialog.isOpen}
        onClose={urlsListDialog.close}
        songs={urlsListDialog.data ?? []}
      />
    </>
  );
};

export default Home;
