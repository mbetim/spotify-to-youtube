import React from "react";
import type { Playlist } from "../types/spotify-api";

interface PlaylistItemProps {
  playlist: Playlist;
}

const Info: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <p>
    <strong>{title}: </strong>
    {value}
  </p>
);

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist }) => {
  return (
    <li className="overflow-hidden rounded-lg border">
      {playlist.images[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={playlist.images[0].url}
          alt={playlist.name}
          className="w-full object-cover"
        />
      )}

      <div className="p-2">
        <p className="text-lg font-bold">{playlist.name}</p>

        <Info title="Owner" value={playlist.owner.display_name} />

        <Info title="Tracks" value={playlist.tracks.total.toString()} />
      </div>
    </li>
  );
};
