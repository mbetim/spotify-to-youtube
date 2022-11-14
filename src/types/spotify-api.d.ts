export interface PlaylistImage {
  url: string;
  height: number;
  width: number;
}

export interface Followers {
  href: string;
  total: number;
}

export interface Owner {
  external_urls: {
    spotify: string;
  };
  followers: Followers;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: PlaylistImage[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface SpotifyList<T> {
  items: T[];
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}
