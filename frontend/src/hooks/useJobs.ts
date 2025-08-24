// src/hooks/useJobs.js
import { useJobContext } from '../contexts/JobContext';

export const useJobs = () => {
  return useJobContext();
};