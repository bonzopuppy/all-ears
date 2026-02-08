import { authedFetchJson } from './authed-fetch';

export const aiAPI = {
  async generatePathways({ nodeType, nodeId, nodeName, context }) {
    return authedFetchJson('/api/ai/generate-pathways', {
      method: 'POST',
      body: { nodeType, nodeId, nodeName, context }
    });
  },

  async generateNarrative({ fromNode, toNode, connectionType }) {
    return authedFetchJson('/api/ai/generate-narrative', {
      method: 'POST',
      body: { fromNode, toNode, connectionType }
    });
  }
};
