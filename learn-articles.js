// Learn library content. Blocks: string = paragraph; ['call'|'tip'|'warn', label, text]; ['quote', text, cite]; ['list', [items]]; ['steps', [[title, text]]]
const TR = ['Thomas Reed', 'Behavioral Science Lead', 'assets/boy/av-thomas.webp'];
const ED = ['BetOnYou Editorial', 'Learn team', ''];
export const ARTICLES = {
  'two-minute-rule': { title: 'The two-minute rule: how to start habits that last', tag: 'Habits', min: '6 min', date: 'Oct 6, 2026', img: 'photo-1484480974693-6ca0a78fb36b', by: TR,
    lead: 'Most habits fail at the start, not the middle. Shrink the first step until it takes two minutes, and starting stops being the hard part.',
    sections: [
      ['Why starting is the bottleneck', ['When a new habit feels big, your brain treats it like a project. Projects need planning, energy and the right mood, so they get postponed.', 'The two-minute rule flips this. Instead of committing to the full behavior, you commit to the opening move: put on your shoes, open the notebook, play one scale. The goal is to make starting so easy that saying no feels silly.']],
      ['Shrink, then grow', ['Two minutes is not the destination. It is a way to build the identity of someone who shows up. Once showing up is automatic, you extend the session.', ['steps', [['Pick the habit', 'Write the full version: "Read 20 pages every night."'], ['Find the first two minutes', '"Open my book and read one page."'], ['Do only that for a week', 'Stop when the two minutes are up, even if you want more.'], ['Grow by small steps', 'Add a few minutes each week once the start feels automatic.']]], ['tip', 'QUICK TIP', 'Stopping on purpose after two minutes in the first week feels odd, but it protects the habit from turning back into a chore.']]],
      ['Make it count in BetOnYou', ['A two-minute habit pairs well with daily proof. A photo of the open book or the first line written is enough to keep a streak honest, and it keeps the bar low on hard days.']]
    ],
    take: ['Starting is the hardest part of most habits.', 'Shrink the first step until it takes two minutes.', 'Protect the habit before you grow it.', 'Small daily proof keeps a streak honest.'] },
  'telling-someone': { title: 'Why telling someone doubles your follow-through', tag: 'Accountability', min: '5 min', date: 'Sep 29, 2026', img: 'photo-1543269865-cbf427effbad', by: TR,
    lead: 'A goal you keep to yourself is easy to quietly drop. Telling the right person turns it into a promise with a witness.',
    sections: [
      ['Private goals are easy to abandon', ['When nobody knows about a goal, quitting costs nothing socially. You can rename it, postpone it or forget it without explaining yourself.', 'Sharing a goal with someone you respect changes the cost of quitting. It is no longer a private decision. It is a conversation you would have to have.']],
      ['Who you tell matters', ['Announcing a goal to a crowd can backfire: the praise can feel like progress and reduce the drive to act. The effect works best with a small number of people who will actually check in.', ['list', ['Choose people who will ask about it, not just cheer once.', 'Tell them what you will do and by when.', 'Agree on how you will show progress.']], ['call', 'KEY INSIGHT', 'Accountability works through follow-up, not announcement. One person who checks in beats a hundred who liked a post.']]],
      ['How Believers fit in', ['In BetOnYou, the people you tell become Believers. They see your proof, encourage you and can back your challenge, which keeps the follow-up built in.']]
    ],
    take: ['Private goals are cheap to quit.', 'Tell a few people who will follow up.', 'Be specific about what and when.', 'Believers make the follow-up automatic.'] },
  'identity-habits': { title: 'Identity-based habits: become the person, keep the behavior', tag: 'Mindset', min: '5 min', date: 'Sep 22, 2026', img: 'photo-1490730141103-6cac27aaab94', by: TR,
    lead: 'Outcome goals tell you what you want. Identity goals tell you who you are becoming. The second kind lasts longer.',
    sections: [
      ['Outcomes versus identity', ['"I want to read more" is an outcome. "I am a reader" is an identity. When a behavior matches how you see yourself, it needs less willpower because skipping it feels out of character.']],
      ['Every action is a vote', ['You do not change identity with one big decision. You change it with small repeated actions that prove it to yourself. Each page read is a small vote for "I am a reader."', ['quote', 'Every action you take is a vote for the type of person you wish to become.', '— James Clear, Atomic Habits'], ['tip', 'TRY THIS', 'Write your challenge as an identity sentence first: "I am someone who practices guitar every evening." Then pick the smallest daily action that proves it.']]],
      ['Proof builds belief', ['A streak of verified check-ins is evidence. Looking back at 20 days of proof makes the new identity feel real, which makes day 21 easier.']]
    ],
    take: ['Frame goals as who you are becoming.', 'Small actions are votes for that identity.', 'Verified proof turns votes into belief.'] },
  'systems-beat-goals': { title: 'Systems beat goals: design for the process', tag: 'Productivity', min: '7 min', date: 'Sep 15, 2026', img: 'photo-1454165804606-c3d57bc86b40', by: ED,
    lead: 'Goals set the direction. Systems decide whether you get there. Design the daily process and the result tends to follow.',
    sections: [
      ['The problem with goals alone', ['Winners and losers often share the same goal. What separates them is the system they run every day. A goal also ends when you reach it, which is why progress often fades afterward.']],
      ['What a good system looks like', [['list', ['A clear trigger: a time, place or preceding action.', 'A small default action you can do on a bad day.', 'A way to see progress, like a streak or a log.', 'A consequence for skipping that you feel today.']], 'You do not need all four on day one. Start with the trigger and the small action, then add visibility and stakes.']],
      ['Turning a goal into a system', [['steps', [['Name the outcome', '"Finish my online course by December."'], ['Define the daily input', '"One lesson every weekday at 7 PM."'], ['Add proof', 'A screenshot of the completed lesson.'], ['Add a stake', 'Something you would rather not lose if you skip.']]]]]
    ],
    take: ['Goals set direction; systems produce results.', 'Design triggers, small defaults and visible progress.', 'A stake makes skipping cost something today.'] },
  'loss-aversion': { title: 'Loss aversion: the strongest lever in behavior change', tag: 'Behavior Science', min: '8 min', date: 'Aug 25, 2026', img: 'photo-1554224155-6726b3ff858f', by: TR,
    lead: 'We work harder to avoid losing something than to gain the same amount. That asymmetry is one of the most reliable findings in behavioral economics.',
    sections: [
      ['What the research found', ['In their work on prospect theory, Daniel Kahneman and Amos Tversky showed that people weigh losses more heavily than equivalent gains. Many studies since estimate that a loss feels roughly twice as strong as a gain of the same size.', ['call', 'DID YOU KNOW?', 'Kahneman received the Nobel Memorial Prize in Economic Sciences in 2002, in part for this work on decision-making under risk.']]],
      ['Why it matters for goals', ['Rewards for good habits are usually far away. The cost of skipping today is usually zero. Loss aversion lets you move a cost into the present: if skipping means losing something you already own, today becomes the day that matters.']],
      ['Using it without backfiring', [['list', ['Choose a stake that stings but does not cause real stress.', 'Make the rules clear before you start.', 'Pair the stake with support, not just pressure.']], ['warn', 'WATCH OUT', 'A stake that is too large can create anxiety and lead people to avoid the goal entirely. Start modest and raise it once the habit is stable.']]]
    ],
    take: ['Losses feel stronger than equal gains.', 'Stakes move the cost of skipping into today.', 'Keep stakes meaningful but manageable.'] },
  'if-then': { title: 'Implementation intentions: the "if-then" that beats willpower', tag: 'Behavior Science', min: '7 min', date: 'Aug 18, 2026', img: 'photo-1434030216411-0b793f4b4173', by: TR,
    lead: 'Deciding in advance exactly when and where you will act removes the daily negotiation with yourself.',
    sections: [
      ['The idea', ['Psychologist Peter Gollwitzer described implementation intentions as plans in an if-then format: "If it is 7 AM on a weekday, then I will practice Spanish for 15 minutes at the kitchen table." Research across many studies links these plans to better follow-through than intentions alone.']],
      ['Why it works', ['An if-then plan hands the decision to the situation. When the cue appears, the action is already chosen, so you skip the moment where motivation usually loses.', ['tip', 'FORMULA', 'If [time or situation], then I will [specific action] at [place].']]],
      ['Plan for obstacles too', ['Add a second plan for the most likely obstacle: "If I miss the morning slot, then I will do it right after dinner." This keeps one bad morning from breaking the streak.']]
    ],
    take: ['Decide when, where and what in advance.', 'Let the cue make the decision.', 'Write a backup plan for the usual obstacle.'] },
  'social-proof': { title: 'Social proof: why we do what others do', tag: 'Behavior Science', min: '6 min', date: 'Aug 11, 2026', img: 'photo-1529156069898-49953e39b3ac', by: TR,
    lead: 'When we are unsure, we look at what people like us are doing. Seeing others follow through makes it feel normal to follow through too.',
    sections: [
      ['What social proof is', ['Robert Cialdini popularized social proof as one of the main principles of influence: people use the behavior of others as a guide, especially when they are uncertain or when the others feel similar to them.']],
      ['Using it for your goals', [['list', ['Spend time around people already doing the habit.', 'Follow stories from people with goals like yours.', 'Share your own progress so others see it is possible.']], 'It works in both directions. A circle that treats skipping as normal will pull you that way too, so choose your circle on purpose.']],
      ['The community effect', ['Seeing other members check in every day turns consistency from an exception into the norm. Your own proof does the same for someone else.']]
    ],
    take: ['We copy people we see as similar.', 'Surround yourself with people who follow through.', 'Your progress is social proof for others.'] },
  'tiny-wins': { title: 'Tiny wins: the psychology of momentum', tag: 'Mindset', min: '5 min', date: 'Aug 4, 2026', img: 'photo-1506126613408-eca07ce68773', by: ED,
    lead: 'Small, visible progress does more for motivation than big plans. Momentum is built one recorded win at a time.',
    sections: [
      ['The progress principle', ['Teresa Amabile and Steven Kramer studied thousands of daily work diaries and found that making progress on meaningful work, even small progress, was one of the strongest drivers of good days.']],
      ['Make wins visible', ['A win you cannot see is easy to forget. Recording each one, with a check-in or a photo, creates a trail you can look back on when motivation dips.', ['tip', 'TRY THIS', 'At the end of each day, note one small thing you moved forward. After a week, read the list.']]],
      ['Protect the chain', ['Once you have a short streak, the wish not to break it becomes its own motivation. Keep the daily action small enough that the chain survives busy days.']]
    ],
    take: ['Small progress drives motivation.', 'Record wins so you can see them.', 'Keep the daily action small enough to protect the streak.'] },
  'home-workout': { title: 'How to build a home workout habit that beats the gym', tag: 'Fitness', min: '6 min', date: 'Jul 28, 2026', img: 'photo-1544367567-0f2fcb009e0b', by: ED,
    lead: 'The best workout is the one you actually do. At home, the commute disappears and the only obstacle left is starting.',
    sections: [
      ['Remove the friction', ['Pick one spot and leave your mat or shoes there. Every item you have to find before starting is a reason to skip.']],
      ['Start smaller than you think', [['steps', [['Week 1', '10 minutes, same time each day.'], ['Week 2', '15 minutes, add one new movement.'], ['Week 3', '20 minutes, add a short warm-up routine.'], ['Week 4', 'Keep the time, raise the effort.']]], ['tip', 'QUICK TIP', 'Attach the session to something you already do, like right after your morning coffee.']]],
      ['Prove it', ['A quick photo or a screenshot from a workout app is enough proof for a daily check-in. It keeps the habit honest without making it complicated.']]
    ],
    take: ['Remove setup friction.', 'Start with 10 minutes and grow slowly.', 'Anchor the session to an existing routine.'] },
  'procrastination': { title: 'Beat procrastination with commitment devices', tag: 'Productivity', min: '9 min', date: 'Jul 21, 2026', img: 'photo-1513258496099-48168024aec0', by: TR,
    lead: 'Procrastination is often a problem of timing, not character. Commitment devices let your present self make decisions your future self cannot undo.',
    sections: [
      ['Why we put things off', ['We tend to value rewards now more than rewards later, a pattern economists call present bias. The task feels unpleasant now and the benefit feels far away, so later always looks better.']],
      ['What a commitment device is', ['A commitment device is a choice you make in advance that limits your future options or adds a cost to backing out. Ulysses tying himself to the mast is the classic example.', ['list', ['Blocking distracting apps during study hours.', 'Booking a session with someone who expects you.', 'Putting a stake on finishing by a deadline.']]]],
      ['Making it stick', ['The device works best when it is set up before the temptation arrives and is hard to undo in the moment. Decide the rules on a calm day, not at 9 PM when the task is due.', ['call', 'KEY INSIGHT', 'A commitment device does not create motivation. It protects the decision you already made.']]]
    ],
    take: ['Procrastination is driven by present bias.', 'Commit in advance, when you are calm.', 'Make backing out costly or inconvenient.'] },
  'habit-loop': { title: 'The habit loop, decoded: cue, routine, reward', tag: 'Habits', min: '7 min', date: 'Jul 7, 2026', img: 'photo-1512820790803-83ca734da794', by: TR,
    lead: 'Every habit runs on the same loop. Learn to see the cue, the routine and the reward, and you can redesign almost any habit.',
    sections: [
      ['The three parts', [['list', ['Cue: the trigger, such as a time, place, feeling or preceding action.', 'Routine: the behavior itself.', 'Reward: the payoff that tells your brain to repeat it.']], 'Charles Duhigg popularized this model in The Power of Habit, building on research into how habits form in the brain.']],
      ['Building a new loop', ['Choose a cue that already happens every day, attach a small routine to it and add a reward you feel immediately, like ticking off a check-in.', ['tip', 'TRY THIS', '"After I pour my evening tea (cue), I read 10 pages (routine), then log the check-in (reward)."']]],
      ['Changing an old loop', ['Keep the cue and the reward, but swap the routine. If scrolling at night is the habit, the cue might be getting into bed and the reward might be winding down. A book can deliver the same reward.']]
    ],
    take: ['Habits run on cue, routine and reward.', 'Attach new routines to existing cues.', 'To change a habit, keep the cue and swap the routine.'] },
  'believer-effect': { title: "The believer effect: why other people's money changes everything", tag: 'Accountability', min: '6 min', date: 'Jun 30, 2026', img: 'photo-1522071820081-009f0129c71c', by: TR,
    lead: 'When someone backs your goal with their own support, your challenge stops being only about you.',
    sections: [
      ['From private promise to shared stake', ['Letting yourself down is uncomfortable. Letting down someone who believed in you is harder. When Believers back a challenge, quitting affects people you care about, which adds weight to every check-in.']],
      ['Support, not surveillance', ['The goal is not pressure for its own sake. Believers who see your proof can encourage you on hard days and celebrate milestones, which is what keeps the stake from feeling like a punishment.', ['call', 'HOW IT WORKS IN BETONYOU', 'Believers follow your challenge, see your verified proof and can back you. Their support is visible to you throughout the challenge.']]],
      ['Choosing your Believers', [['list', ['People who will notice if you go quiet.', 'People who will encourage, not shame.', 'Two or three is enough to start.']]]]
    ],
    take: ['Shared stakes make quitting a social decision.', 'Believers work best as support, not pressure.', 'Pick a few people who will actually follow along.'] },
  'public-commitment': { title: "Public commitment: the social contract you can't quietly break", tag: 'Accountability', min: '5 min', date: 'Jun 23, 2026', img: 'photo-1600880292203-757bb62b4baf', by: ED,
    lead: 'Saying a goal out loud to specific people creates a small social contract. Breaking it quietly is no longer an option.',
    sections: [
      ['Why public commitments hold', ['People like to act consistently with what they have said. Once a commitment is visible, changing course means explaining yourself, which adds friction to quitting.']],
      ['Make the commitment specific', [['list', ['What exactly you will do.', 'How often and until when.', 'How others will see that you did it.']], ['warn', 'COMMON MISTAKE', 'Vague public goals like "getting healthier this year" are easy to reinterpret later. Specific ones are not.']]],
      ['Keep it visible', ['A commitment made once and never mentioned again loses its power. Regular proof keeps it in view for you and for the people who are following along.']]
    ],
    take: ['Visible commitments are harder to drop.', 'Be specific about what, when and how you will show it.', 'Regular proof keeps the commitment alive.'] },
  'quit-smoking': { title: '"I quit smoking after 12 failed tries"', tag: 'Sample story', min: '4 min', date: 'Sep 8, 2026', img: 'photo-1499209974431-9dddcece7f88', by: ED, sample: true,
    lead: 'David staked $500 and gave his believers veto power over the payout. This is a sample story showing how a challenge like his could be set up.',
    sections: [
      ['The setup', ['After many attempts on his own, David decided the next try would not be private. He set a 90-day challenge, put a stake behind it and invited three people close to him as Believers.']],
      ['What changed this time', [['list', ['A daily check-in instead of a vague promise.', 'Believers who could see whether he was keeping it.', 'A stake large enough that relapsing would cost him.']], ['quote', 'The money mattered, but what really held me was knowing they would see it.', '— David, sample story']]],
      ['What you can borrow', ['You do not need David\'s exact setup. The pattern is the useful part: a clear daily rule, people who follow along and a reason to care today.']]
    ],
    take: ['Make the attempt visible to people you trust.', 'Use a daily check-in, not a distant deadline.', 'Choose a stake that matters to you.'] },
  'novel-90-days': { title: '"I wrote a novel in 90 days"', tag: 'Sample story', min: '4 min', date: 'Aug 30, 2026', img: 'photo-1532012197267-da84d127e765', by: ED, sample: true,
    lead: '1,000 words a day, verified by screenshot, funded by her writing group. A sample story about turning a long creative goal into daily proof.',
    sections: [
      ['A daily word count', ['Ninety days is long. One thousand words is not. Breaking the novel into a daily target turned an intimidating goal into a manageable evening routine.']],
      ['Proof that fits the work', ['A screenshot of the word counter became the daily proof. It took seconds and left no room for "I worked on it in my head."', ['tip', 'TRY THIS', 'Pick proof that is a natural by-product of the work, so checking in never feels like extra effort.']]],
      ['The group behind her', ['Her writing group backed the challenge as Believers. On the evenings she did not want to write, the group chat did the motivating for her.']]
    ],
    take: ['Break long goals into a daily target.', 'Use proof that comes naturally from the work.', 'Let a group carry you on low days.'] },
  'saved-6000': { title: '"I saved $6,000 in six months"', tag: 'Sample story', min: '4 min', date: 'Aug 16, 2026', img: 'photo-1579621970795-87facc2f976d', by: ED, sample: true,
    lead: 'Marcus automated a weekly transfer and let his family watch the streak. A sample story about making a money goal visible.',
    sections: [
      ['Automate the default', ['Marcus set up a weekly transfer into a separate account. Saving became the default, and skipping required an active decision.']],
      ['Make the streak visible', ['Each week he checked in with a screenshot of the transfer. His family could see the streak grow, which turned saving into something they shared.', ['quote', 'Once they were watching, breaking the streak felt like breaking a promise to them.', '— Marcus, sample story']]],
      ['Plan for rough weeks', ['He agreed in advance on a smaller fallback amount for tight weeks, so the streak could continue even when money was short.']]
    ],
    take: ['Automate the habit so skipping is the active choice.', 'Weekly proof keeps the goal in view.', 'Set a fallback for hard weeks.'] },
  'maya-half-marathon': { title: 'How Maya ran her first half-marathon with $300 on the line', tag: 'Success Stories', min: '4 min', date: 'Jul 31, 2026', img: 'photo-1476480862126-209bfaa8edc8', by: ED, sample: true,
    lead: 'Six believers, one deadline, zero missed long runs. The stake made quitting the expensive option. This is a sample story.',
    sections: [
      ['One race, one plan', ['Maya picked a race date 14 weeks out and built a plan around three runs a week, with one long run every weekend.']],
      ['The long run was the challenge', ['Instead of tracking every run, she made the weekend long run her proof. Missing it would cost part of her stake, so it became non-negotiable.', ['tip', 'QUICK TIP', 'Put the stake on the one session that matters most rather than every small action.']]],
      ['Race day', ['Her Believers had followed every long run, so crossing the line felt like a shared finish rather than a solo effort.']]
    ],
    take: ['Pick a clear date and work backwards.', 'Put the stake on the session that matters most.', 'Let Believers share the finish.'] }
};
