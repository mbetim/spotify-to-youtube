export interface AddedBy {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

export interface PlaylistTrack {
  added_at: Date;
  added_by: AddedBy;
  is_local: boolean;
  track: Track;
  video_thumbnail: {
    url?: string;
  };
}
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
    items: PlaylistTrack[];
    limit?: number;
    next?: null | number;
    offset?: number;
    previous?: null | number;
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
