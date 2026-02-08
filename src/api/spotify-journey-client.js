import { authedFetchJson } from './authed-fetch';

export const spotifyJourneyAPI = {
  async exportJourneyToPlaylist({ journeyId, title, description, trackUris }) {
    return authedFetchJson('/api/spotify/create-playlist', {
      method: 'POST',
      body: { journeyId, title, description, trackUris }
    });
  }
};
