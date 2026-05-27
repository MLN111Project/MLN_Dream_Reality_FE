import { timelineStages, timelineEvents } from '../src/data/timeline.js';
import vi from '../src/i18n/locales/vi.js';

export function buildTimelineQuestions() {
  const questions = [];

  timelineStages.forEach((stage) => {
    const events = timelineEvents[stage.id] || [];
    events.forEach((ev) => {
      const tr = vi.events[ev.id];
      if (!tr) return;

      questions.push({
        id: ev.id,
        stageId: stage.id,
        stageTitle: vi.stages[stage.id]?.title || stage.title,
        title: tr.title,
        narrative: tr.narrative,
        choices: ev.choices.map((ch, i) => ({
          label: tr.choices[i] || ch.label,
          effects: ch.effects,
          flag: ch.flag || null,
        })),
      });
    });
  });

  return questions;
}
