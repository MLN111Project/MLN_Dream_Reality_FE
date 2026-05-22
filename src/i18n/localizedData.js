import { careers } from '../data/careers';
import { environments } from '../data/environments';
import { timelineStages, timelineEvents } from '../data/timeline';
import { endings as endingsMeta } from '../data/endings';
import en from './locales/en';
import vi from './locales/vi';

const locales = { en, vi };

function L(lang) {
  return locales[lang] || locales.en;
}

export function getCareers(lang) {
  const loc = L(lang);
  return careers.map((c) => ({
    ...c,
    title: loc.careers[c.id].title,
    tagline: loc.careers[c.id].tagline,
  }));
}

export function getEnvironments(lang) {
  const loc = L(lang);
  return environments.map((e) => ({
    ...e,
    title: loc.environments[e.id].title,
    description: loc.environments[e.id].description,
  }));
}

export function getTimelineStages(lang) {
  const loc = L(lang);
  return timelineStages.map((s) => ({
    ...s,
    title: loc.stages[s.id].title,
    subtitle: loc.stages[s.id].subtitle,
  }));
}

export function getTimelineEvents(lang) {
  const loc = L(lang);
  const result = {};
  Object.entries(timelineEvents).forEach(([stageId, events]) => {
    result[stageId] = events.map((ev) => {
      const tr = loc.events[ev.id];
      return {
        ...ev,
        title: tr.title,
        narrative: tr.narrative,
        choices: ev.choices.map((ch, i) => ({
          ...ch,
          label: tr.choices[i],
          flag: ch.flag,
        })),
      };
    });
  });
  return result;
}

export function getEndings(lang) {
  const loc = L(lang);
  const result = {};
  Object.keys(endingsMeta).forEach((key) => {
    if (!loc.endings[key]) return;
    result[key] = {
      ...endingsMeta[key],
      title: loc.endings[key].title,
      subtitle: loc.endings[key].subtitle,
      quote: loc.endings[key].quote,
      description: loc.endings[key].description,
    };
  });
  return result;
}

export function getEnvModifierLabels(lang) {
  return L(lang).envModifiers;
}
