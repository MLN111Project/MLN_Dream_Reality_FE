import {
  FaChalkboardTeacher,
  FaFilm,
  FaPalette,
  FaCode,
  FaPenNib,
  FaLanguage,
  FaRocket,
} from 'react-icons/fa';
import itImage from '../assets/it.png';
import mediaDesignImage from '../assets/media_design.png';
import teacherImage from '../assets/teacher.png';
import directorImage from '../assets/director.png';
import artImage from '../assets/art.png';
import languageImage from '../assets/language.png';
import businessImage from '../assets/business.png';

export const careers = [
  {
    id: 'developer',
    title: 'Developer',
    tagline: 'Build for everyone, freely',
    icon: FaCode,
    color: '#0891b2',
    status: 'active',
    image: itImage,
    baseStats: { passion: 88, creativity: 85, money: 45 },
  },
  {
    id: 'designer',
    title: 'Media & Design',
    tagline: 'Creativity under KPI pressure',
    icon: FaPenNib,
    color: '#2563eb',
    status: 'active',
    image: mediaDesignImage,
    baseStats: { passion: 85, creativity: 90, money: 50 },
  },
  {
    id: 'teacher',
    title: 'Teacher',
    tagline: 'Shape minds, shape the future',
    icon: FaChalkboardTeacher,
    color: '#6d4fc7',
    status: 'active',
    image: teacherImage,
    baseStats: { passion: 90, creativity: 75, money: 40 },
  },
  {
    id: 'filmmaker',
    title: 'Filmmaker',
    tagline: 'Tell stories the world needs',
    icon: FaFilm,
    color: '#db2777',
    status: 'active',
    image: directorImage,
    baseStats: { passion: 95, creativity: 92, money: 35 },
  },
  {
    id: 'artist',
    title: 'Artist',
    tagline: 'Create what cannot be measured',
    icon: FaPalette,
    color: '#ea580c',
    status: 'active',
    image: artImage,
    baseStats: { passion: 98, creativity: 98, money: 25 },
  },
  {
    id: 'translator',
    title: 'Language',
    tagline: 'Bridge worlds with words',
    icon: FaLanguage,
    color: '#059669',
    status: 'active',
    image: languageImage,
    baseStats: { passion: 80, creativity: 70, money: 55 },
  },
  {
    id: 'founder',
    title: 'Business',
    tagline: 'Change the world — or burn trying',
    icon: FaRocket,
    color: '#7c3aed',
    status: 'active',
    image: businessImage,
    baseStats: { passion: 96, creativity: 80, money: 30 },
  },
];

export const ACTIVE_CAREER_IDS = careers.filter((c) => c.status === 'active').map((c) => c.id);
