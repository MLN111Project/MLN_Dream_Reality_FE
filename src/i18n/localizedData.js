import { careers } from '../data/careers';
import { environments } from '../data/environments';
import { timelineStages, timelineEvents } from '../data/timeline';
import { endings as endingsMeta } from '../data/endings';
import vi from './locales/vi';

const loc = vi;

export function getCareers() {
  return careers.map((c) => ({
    ...c,
    title: loc.careers[c.id]?.title ?? c.title,
    tagline: loc.careers[c.id]?.tagline ?? c.tagline,
    status: c.status,
    comingSoonLabel: loc.common?.comingSoon,
  }));
}

export function getEnvironments() {
  return environments.map((e) => ({
    ...e,
    title: loc.environments[e.id].title,
    description: loc.environments[e.id].description,
  }));
}

export function getTimelineStages() {
  return timelineStages.map((s) => ({
    ...s,
    title: loc.stages[s.id].title,
    subtitle: loc.stages[s.id].subtitle,
  }));
}

export function getTimelineEvents() {
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

export function getEndings() {
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

export function getEnvModifierLabels() {
  return loc.envModifiers;
}
