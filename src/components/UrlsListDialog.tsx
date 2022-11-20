import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

interface ListUrlsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  songs: { song: string; url: string }[];
}

export const UrlsListDialog: React.FC<ListUrlsDialogProps> = ({
  isOpen,
  onClose,
  songs,
}) => {
  const [showSongName, setShowSongName] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(songs.map(({ url }) => url).join("\n"));
    alert("Copied to clipboard!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>YouTube URLs</DialogTitle>

        <div className="flex justify-between">
          <label className="flex items-center gap-1">
            Show songs name
            <input
              type="checkbox"
              checked={showSongName}
              onChange={() => setShowSongName((prev) => !prev)}
            />
          </label>

          <button
            onClick={handleCopy}
            className="rounded border px-1 shadow transition-colors hover:bg-gray-100"
          >
            Copy links
          </button>
        </div>

        <ul>
          {songs.map((song) => (
            <li key={song.song} className="mb-2">
              <a href={song.url} target="_blank" rel="noreferrer">
                {showSongName && <p>{song.song}</p>}

                {song.url}
              </a>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
