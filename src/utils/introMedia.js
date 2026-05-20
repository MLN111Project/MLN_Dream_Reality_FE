import imgENMain from '../assets/Dream&Reality_EN.png';
import imgEN1 from '../assets/Dream&Reality1_EN.png';
import imgEN2 from '../assets/Dream&Reality2_EN.png';
import imgEN3 from '../assets/Dream&Reality3_EN.png';
import imgVNMain from '../assets/Dream&Reality_VN.png';
import imgVN1 from '../assets/Dream&Reality1_VN.png';
import imgVN2 from '../assets/Dream&Reality2_VN.png';
import imgVN3 from '../assets/Dream&Reality3_VN.png';
import videoEN from '../assets/Storyboard_EN.mp4';
import videoVN from '../assets/Storyboard_VN.mp4';

export const introImagesByLang = {
  en: [imgENMain, imgEN1, imgEN2, imgEN3],
  vi: [imgVNMain, imgVN1, imgVN2, imgVN3],
};

export const introVideoByLang = {
  en: videoEN,
  vi: videoVN,
};

export function getIntroImages(lang) {
  return introImagesByLang[lang] || introImagesByLang.en;
}

export function getIntroVideo(lang) {
  return introVideoByLang[lang] || introVideoByLang.en;
}
