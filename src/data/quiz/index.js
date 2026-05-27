import { developerQuiz } from './developer.js';
import { designerQuiz } from './designer.js';

export const quizByCareer = {
  developer: developerQuiz,
  designer: designerQuiz,
};

export function getQuizForCareer(careerId) {
  return quizByCareer[careerId] || [];
}
