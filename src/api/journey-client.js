import { authedFetchJson } from './authed-fetch';

export const journeyAPI = {
  async create({ title, startingNodeType, startingNodeId, startingNodeName }) {
    return authedFetchJson('/api/journeys', {
      method: 'POST',
      body: { title, startingNodeType, startingNodeId, startingNodeName }
    });
  },

  async get(id) {
    return authedFetchJson(`/api/journeys/${id}`);
  },

  async update(id, patch) {
    return authedFetchJson(`/api/journeys/${id}`, {
      method: 'PATCH',
      body: patch
    });
  }
};
