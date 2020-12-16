import LOADING_PULSE_01 from './pulse-r-01.svg';
import LOADING_PINKY_PIG_01 from './pinky-pig-r-01.svg';

const LOADER_ARRAY: string[] = [LOADING_PULSE_01, LOADING_PINKY_PIG_01];
export const LOADER_OBJECTS = {
  LOADER_ARRAY,
  LOADING_PULSE_01,
  LOADING_PINKY_PIG_01,
  GET_RANDOM_LOADER: () =>
    LOADER_OBJECTS.LOADER_ARRAY[
      Math.floor(Math.random() * LOADER_OBJECTS.LOADER_ARRAY.length)
    ],
};
