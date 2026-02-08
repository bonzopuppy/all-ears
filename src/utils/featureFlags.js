export const isJourneyEnabled = () => {
  return process.env.REACT_APP_FEATURE_JOURNEY_ENABLED === 'true';
};
