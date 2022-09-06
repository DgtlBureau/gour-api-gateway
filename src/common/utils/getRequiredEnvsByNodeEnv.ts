import { NodeEnv } from '../types/App';

export const getRequiredEnvsByNodeEnv = (
  envs: { [key in NodeEnv | 'common']?: string[] },
  nodeEnv: NodeEnv,
): string[] => {
  return envs[nodeEnv]?.concat(envs['common']) || [];
};
