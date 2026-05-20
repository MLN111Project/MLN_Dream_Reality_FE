export const timelineStages = [
  { id: 'student', title: 'Student', subtitle: 'Full of hope and potential' },
  { id: 'intern', title: 'Intern', subtitle: 'First taste of the real world' },
  { id: 'fresher', title: 'Fresher', subtitle: 'Entering the workforce' },
  { id: 'year1', title: '1 Year Experience', subtitle: 'Reality sets in' },
  { id: 'year3', title: '3 Years Experience', subtitle: 'A crossroads appears' },
];

export const timelineEvents = {
  student: [
    {
      id: 's1',
      title: 'Family Expectations',
      narrative:
        'Your parents ask: "Will this career make good money?" The weight of expectation settles on your shoulders.',
      choices: [
        {
          label: 'Follow your passion anyway',
          effects: { passion: 10, mentalHealth: -5, money: -5 },
        },
        {
          label: 'Compromise for stability',
          effects: { passion: -8, money: 10, mentalHealth: -3 },
        },
      ],
    },
    {
      id: 's2',
      title: 'First Creative Spark',
      narrative:
        'You create something you are proud of. For a moment, the dream feels real and within reach.',
      choices: [
        {
          label: 'Share it with the world',
          effects: { passion: 8, creativity: 10, socialRecognition: 12 },
        },
        {
          label: 'Keep it private — fear of judgment',
          effects: { passion: 3, creativity: 5, mentalHealth: -5 },
        },
      ],
    },
  ],
  intern: [
    {
      id: 'i1',
      title: 'Unpaid Overtime',
      narrative:
        '"Everyone does it." Your manager assigns weekend work with no compensation. Your time is not valued.',
      choices: [
        {
          label: 'Accept silently',
          effects: { passion: -12, mentalHealth: -10, money: 0, creativity: -5 },
        },
        {
          label: 'Push back professionally',
          effects: { passion: 5, mentalHealth: -5, socialRecognition: -5, money: -3 },
        },
      ],
    },
    {
      id: 'i2',
      title: 'Mentor Recognition',
      narrative:
        'A senior colleague sees your potential and offers genuine guidance. A rare moment of being seen.',
      choices: [
        {
          label: 'Embrace the mentorship',
          effects: { passion: 12, creativity: 8, socialRecognition: 10, mentalHealth: 8 },
        },
        {
          label: 'Stay cautious — trust issues',
          effects: { passion: 3, mentalHealth: -3 },
        },
      ],
    },
  ],
  fresher: [
    {
      id: 'f1',
      title: 'Toxic Management',
      narrative:
        'Your manager takes credit for your work. Meetings feel like performances of power, not collaboration.',
      choices: [
        {
          label: 'Endure for the paycheck',
          effects: { passion: -15, mentalHealth: -12, money: 8, creativity: -10 },
        },
        {
          label: 'Document and escalate',
          effects: { passion: -5, mentalHealth: -8, socialRecognition: 5 },
        },
      ],
    },
    {
      id: 'f2',
      title: 'Low Salary Reality',
      narrative:
        'Rent, food, transport — your salary barely covers survival. The dream feels expensive.',
      choices: [
        {
          label: 'Take a side hustle',
          effects: { money: 15, passion: -8, mentalHealth: -10, creativity: -5 },
        },
        {
          label: 'Cut expenses, hold the dream',
          effects: { money: -5, passion: 5, mentalHealth: -8 },
        },
      ],
    },
  ],
  year1: [
    {
      id: 'y1a',
      title: 'Burnout Warning',
      narrative:
        'You cannot sleep. Your creativity feels hollow. The system demands more than you can give.',
      choices: [
        {
          label: 'Push through — "hustle culture"',
          effects: { passion: -10, mentalHealth: -18, money: 10, creativity: -12 },
        },
        {
          label: 'Take a mental health break',
          effects: { passion: 5, mentalHealth: 15, money: -15, socialRecognition: -5 },
        },
      ],
    },
    {
      id: 'y1b',
      title: 'AI Replacing Jobs',
      narrative:
        'Headlines scream: "AI will replace your profession." Fear spreads through the office like smoke.',
      choices: [
        {
          label: 'Learn new tools desperately',
          effects: { creativity: 10, mentalHealth: -8, passion: -5 },
        },
        {
          label: 'Question the system, not yourself',
          effects: { passion: 8, mentalHealth: 5, socialRecognition: 8 },
        },
      ],
    },
    {
      id: 'y1c',
      title: 'Creative Suppression',
      narrative:
        'Your best ideas are rejected for being "off-brand." You become a machine executing someone else\'s vision.',
      choices: [
        {
          label: 'Conform to keep your job',
          effects: { creativity: -20, passion: -12, money: 5, mentalHealth: -8 },
        },
        {
          label: 'Create secretly on the side',
          effects: { creativity: 15, passion: 10, mentalHealth: -5, money: -5 },
        },
      ],
    },
  ],
  year3: [
    {
      id: 'y3a',
      title: 'Opportunity Abroad',
      narrative:
        'An offer from overseas — better pay, new culture, leaving everything behind.',
      choices: [
        {
          label: 'Take the leap',
          effects: { money: 25, passion: 5, mentalHealth: -10, socialRecognition: -8 },
        },
        {
          label: 'Stay for community',
          effects: { passion: 8, socialRecognition: 15, money: -10 },
        },
      ],
    },
    {
      id: 'y3b',
      title: 'Community Recognition',
      narrative:
        'Your work helps real people. A community thanks you publicly. For once, you feel seen.',
      choices: [
        {
          label: 'Share the moment',
          effects: { socialRecognition: 20, passion: 15, mentalHealth: 12 },
        },
        {
          label: 'Stay humble, keep working',
          effects: { passion: 8, creativity: 5, socialRecognition: 8 },
        },
      ],
    },
    {
      id: 'y3c',
      title: 'The Crossroads',
      narrative:
        'Three paths diverge: climb the corporate ladder, fight to change the system, or walk away entirely.',
      choices: [
        {
          label: 'Climb the ladder',
          effects: { money: 20, passion: -15, creativity: -15, mentalHealth: -10 },
        },
        {
          label: 'Fight for systemic change',
          effects: { passion: 10, socialRecognition: 15, mentalHealth: -5, money: -5 },
        },
        {
          label: 'Walk away from the system',
          effects: { passion: 5, mentalHealth: 10, money: -20, creativity: 10 },
        },
      ],
    },
  ],
};
