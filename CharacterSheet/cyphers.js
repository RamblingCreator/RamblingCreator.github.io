/*

*/

var CYPHERS = [
    {
        id: "ANOTHER_TWIST",
        name: "Another Twist",
        range: "01-02",
        level: "1d6",
        use: "Instant",
        description: "Important problems require elevated focus. One die roll of your choosing gets rerolled."
    },
    {
        id: "BIG_PICTURE",
        name: "Big Picture",
        range: "03-04",
        level: "1d6 + 2",
        use: "Action",
        description: "Everything seems more vivid. For one hour per cypher level, you know when any movement occurs within short range and when large creatures or objects move within long range. You also know the number and size of the creatures or objects in motion."
    },
    {
        id: "BINARY",
        name: "Binary",
        range: "05-06",
        level: "1d6 + 2",
        use: "Instant",
        description: "You correctly guess the PIN code allowing access to a phone, door lock, debit card, and so on, or you guess the alphanumeric passcode for a laptop, website, or similar situation, as long as the level of the object or program is equal to or less than this cypher’s level."
    },
    {
        id: "BODY_BUILDER",
        name: "Body Builder",
        range: "7",
        level: "1d6 + 2",
        use: "Action",
        description: "Drawing on your inner reserves, you add 1 to your Might Edge for one hour (or 2 if the cypher is level 5 or higher)."
    },
    {
        id: "BREATHING_ROOM",
        name: "Breathing Room",
        range: "08-09",
        level: "1d6 + 1",
        use: "Instant",
        description: "As part of a physical action on your part (an attack, an “accidental” bump, a startling shout, pushing by on the way to somewhere else, etc.), you force an NPC within immediate range whose level is lower than this cypher’s level to drop whatever they are holding."
    },
    {
        id: "BURNING_DESIRE",
        name: "Burning Desire",
        range: "10-11",
        level: "1d6",
        use: "Instant",
        description: "This particular predicament allows you to use 1 level of Stress as an asset on your action without incurring a GM intrusion, as"
    },
    {
        id: "CHEATING_DEATH",
        name: "Cheating Death",
        range: "12-13",
        level: "10",
        use: "Instant",
        description: "The circumstances were horrific but not fatal. If you reach the last step on the damage track, you go into a near-death coma for a week rather than dying. You have a serious scar even after you recover."
    },
    {
        id: "CURIOSITY",
        name: "Curiosity",
        range: "14-15",
        level: "1d6 + 2",
        use: "Action",
        description: "You reflect on excellence, adding 1 to your Intellect Edge for one hour (or 2 if this cypher’s level is 5 or higher)."
    },
    {
        id: "DANCE_THROUGH_THE_MAZE",
        name: "Dance Through The Maze",
        range: "16-17",
        level: "1d6",
        use: "Action",
        description: "If you can imagine it, you can become it. All your tasks involving manual dexterity— such as pickpocketing, lockpicking, juggling, operating on a patient, defusing a bomb, and so on—are eased by one step for one hour, or two steps for one hour if this cypher’s level is 5 or higher."
    },
    {
        id: "DEATHLY_SILENT_AND_STILL",
        name: "Deathly Silent And Still",
        range: "18-19",
        level: "1d6",
        use: "Instant",
        description: "You hide so well (assuming there is some way to conceal yourself ) that absolutely no one is aware of you for one round."
    },
    {
        id: "DESPERATE_EFFORT",
        name: "Desperate Effort",
        range: "20-21",
        level: "1d6",
        use: "Instant",
        description: "You’re in the flow, gaining one free level of Effort to one task without spending points from a Pool. The level of Effort provided by this cypher does not count toward the maximum amount of Effort you can normally apply to one task."
    },
    {
        id: "EYE_CONTACT",
        name: "Eye Contact",
        range: "22-23",
        level: "1d6 + 4",
        use: "Instant",
        description: "You convey simple information to a known ally who can see you using only expression, gestures, or references (such as a line from a movie). Only you and your ally understand what is being communicated—or really, that anything is being communicated at all. The limit of the “message” is about one word per level of the cypher."
    },
    {
        id: "FLEE_THE_HUNT!",
        name: "Flee The Hunt!",
        range: "24-25",
        level: "1d6",
        use: "Instant",
        description: "If you’re being chased, you get away. The pursuer eventually gives up (based on the circumstances). However, if the pursuer is given the opportunity—such as you returning—they may give chase again, and this time it is resolved normally."
    },
    {
        id: "GIFT_OF_THE_PIPER",
        name: "Gift Of The Piper",
        range: "26-27",
        level: "1d6",
        use: "Instant",
        description: "Seeing your chance, you take an immediate additional action on your turn."
    },
    {
        id: "GUESS_YOU_HAD_TO_BE_THERE",
        name: "Guess You Had To Be There",
        range: "28-29",
        level: "1d6",
        use: "Action",
        description: "You recall any one experience you’ve ever had. The experience can be no longer than one minute per cypher level, but the recall is perfect, so (for example) if you saw someone dial a phone, you remember the number."
    },
    {
        id: "GUT_FEELING",
        name: "Gut Feeling",
        range: "30-31",
        level: "1d6 + 4",
        use: "Action",
        description: "When faced with a choice between two known options, you pick the most correct one based on the circumstances. If you’re following someone who gives you the slip, you get a gut feeling (provided by the GM) if they turned left or right. If you have to cut the red wire or the green wire to defuse a bomb, you choose the right one. If you’re trying to solve a murder and you’ve narrowed the suspect list down to two, you identify the killer. The gut feeling doesn’t work if neither of the two choices is the correct one."
    },
    {
        id: "HARD_SHOULDER",
        name: "Hard Shoulder",
        range: "32-33",
        level: "1d6 + 4",
        use: "Instant",
        description: "Skill or blind luck allows you to avoid a single attack from your attacker if their level is lower than the cypher’s level. You suffer no damage or effect."
    },
    {
        id: "HELP_FROM_A_STRANGER",
        name: "Help From A Stranger",
        range: "34-35",
        level: "1d6",
        use: "Action",
        description: "You suddenly remember that you brought—or were given—a necessary item not recorded on your character sheet. Alternatively, you know how to cobble together a makeshift replacement for the needed item in a minute’s time, using materials at hand. (Choose whichever fits the situation better.)"
    },
    {
        id: "IMPLORE_THE_FLESH",
        name: "Implore The Flesh",
        range: "36-37",
        level: "1d6 + 2",
        use: "Action",
        description: "Rolling your shoulders and centering your breath, you regain a number of points equal to this cypher’s level to your Speed Pool."
    },
    {
        id: "JIGSAW_SOLVER",
        name: "Jigsaw Solver",
        range: "38-39",
        level: "1d6",
        use: "Action",
        description: "Hardly anything gets past you. All your tasks involving intelligent deduction—such as playing chess, inferring a connection between clues, solving a mathematical problem, finding a bug in computer code, and so on—are eased by two steps for one hour."
    },
    {
        id: "LAST_WORDS",
        name: "Last Words",
        range: "40-41",
        level: "1d6",
        use: "Action",
        description: "If you spend a minute or so speaking to nearby allies, talking about the importance of what you’re about to attempt, how strength comes from unity, how everyone working together creates something greater than its parts, and similar themes, you and your allies lose Stress in an amount equal to the cypher level."
    },
    {
        id: "LEARN_FROM_THE_WEB",
        name: "Learn From The Web",
        range: "42-43",
        level: "1d6",
        use: "Action",
        description: "Sometimes all it takes is focus. For the next day, you are effectively trained in a predetermined skill (or two skills if this cypher’s level is 5 or higher). The skill could be anything (including something specific to the operation of a particular device), or roll a d00 to choose a common skill.\nd00 Result\n01-10 Melee attacks\n11-20 Ranged attacks\n21-40 One type of academic or esoteric\nlore (biology, history, occultism,\nand so on)\n41-50 Researching\n51-60 Forensics\n61-70 Persuasion\n71-75 Mechanics\n76-80 Speed defense\n81-85 Intellect defense\n86-90 Swimming\n91-95 Psychology\n96-00 Stealth"
    },
    {
        id: "LESSON_OF_THE_BONETURNER",
        name: "Lesson Of The Boneturner",
        range: "44-45",
        level: "10",
        use: "Action",
        description: "If you reach the second-to-last step on the damage track (debilitated) and survive the experience, you find renewed purpose during your recovery. When you’re hale again, you gain a character advancement step—skill training, +4 points to add to your Pools, +1 to Effort, or +1 to Edge— without having to spend 4 XP. "
    },
    {
        id: "LIBRARIAN’S_PUPIL",
        name: "Librarian’S Pupil",
        range: "46-47",
        level: "1d6",
        use: "Action",
        description: "You are dramatically but temporarily inspired, allowing you to ease one specific kind of physical action by three steps. Once activated, this boost can be used a number of times equal to the cypher level, but only within a twenty-four-hour period. The boost takes effect each time the action is performed. For example, a level 3 cypher boosts the first three times that action is attempted. Roll a d00 to determine the action.\nd00 Result\n01-15 Melee attack\n16-30 Ranged attack\n31-40 Speed defense\n41-50 Might defense\n51-60 Intellect defense\n61-68 Gymnastics\n69-76 Endurance\n77-84 Driving\n85-92 Equipment operation\n93-94 Stealth\n95-96 Initiative\n97-98 Perception\n99 Performance\n00 Tracking\n"
    },
    {
        id: "LIKE_AN_AVATAR",
        name: "Like An Avatar",
        range: "48-49",
        level: "1d6 + 2",
        use: "Instant",
        description: "Sometimes everything falls perfectly into place. Treat your action as if you had rolled a natural 20."
    },
    {
        id: "MEAT",
        name: "Meat",
        range: "50-51",
        level: "1d6",
        use: "Action",
        description: "You psych yourself up, reducing the Stress you suffer from physical injury by 1 for one hour per cypher level. You still suffer Stress from mental shock or despair normally."
    },
    {
        id: "NEMESIS",
        name: "Nemesis",
        range: "52-53",
        level: "1d6 + 1",
        use: "Action",
        description: "Your actions and/or words are especially startling. One NPC within immediate range whose level is lower than the cypher level decides to leave, using their next five rounds to move away quickly."
    },
    {
        id: "NIGHTFALL",
        name: "Nightfall",
        range: "54-55",
        level: "1d6",
        use: "Action",
        description: "Determined to keep going, you use senses other than sight to get by for one hour per cypher level. You aren’t hindered on tasks to perceive or attack in dark conditions."
    },
    {
        id: "OBSERVER_EFFECT",
        name: "Observer Effect",
        range: "56-57",
        level: "1d6",
        use: "Action",
        description: "When you look around an immediate area, if there are any hidden clues significant to the current investigation, you notice them."
    },
    {
        id: "OF_THE_BEHOLDING",
        name: "Of The Beholding",
        range: "58-59",
        level: "1d6",
        use: "Action",
        description: "Feeling especially alert, you have an asset to perception tasks for one hour per cypher"
    },
    {
        id: "OF_THE_FLESH",
        name: "Of The Flesh",
        range: "60-61",
        level: "1d6",
        use: "Action",
        description: "Your body embraces fight instead of flight. All your noncombat tasks involving raw strength—such as breaking down a door, lifting a heavy boulder, forcing open elevator doors, competing in a weightlifting competition, and so on—are eased by two steps for one hour."
    },
    {
        id: "PANOPTICON",
        name: "Panopticon",
        range: "62-63",
        level: "1d6",
        use: "Instant",
        description: "Fear is a great motivator. You memorize everything you see for thirty seconds per cypher level and store what you see permanently in your long-term memory. This cypher is useful for watching someone pick a specific lock, enter a complex code, or do something else that happens quickly."
    },
    {
        id: "PERSONAL_SPACE",
        name: "Personal Space",
        range: "64-65",
        level: "1d6 + 4",
        use: "Action",
        description: "Flinching isn’t always bad. For the next day, you have an asset to Speed defense rolls."
    },
    {
        id: "RISEN_WIND",
        name: "Risen Wind",
        range: "66-67",
        level: "1d6 + 2",
        use: "Action",
        description: "You catch your second wind, regaining a number of points equal to this cypher’s level to your Might Pool."
    },
    {
        id: "SCULPTOR’S_TOOL",
        name: "Sculptor’S Tool",
        range: "68-69",
        level: "1d6",
        use: "Instant",
        description: "The tool feels so comfortable in your hand that you have an additional asset for any one task using it, even if that means exceeding the normal limit of two assets."
    },
    {
        id: "SHOW_MUST_GO_ON",
        name: "Show Must Go On",
        range: "70-71",
        level: "1d6",
        use: "Action",
        description: "You spot an untended ladder, hard hat, clipboard and pen, cleaning cart and apron, or whatever is appropriate to the circumstances that, once obtained, allow you and up to two allies to slip into a building without drawing attention. If your entrance is challenged by guards or others monitoring the area, you and your allies’ disguise and/or associated deception tasks are eased by two steps. The benefits of this cypher usually last for several hours."
    },
    {
        id: "SMELL_OF_BLOOD",
        name: "Smell Of Blood",
        range: "72-73",
        level: "1d6",
        use: "Instant",
        description: "Outraged, inspired, or fueled by desperate need, your attack deals extra damage equal to this cypher’s level."
    },
    {
        id: "SPIRAL’S_LUCK",
        name: "Spiral’S Luck",
        range: "74",
        level: "1d6",
        use: "Instant",
        description: "Luck sometimes swings your way, and an attack that would normally inflict a serious injury on you gives 2 points of Stress instead."
    },
    {
        id: "SQUIRM",
        name: "Squirm",
        range: "75-76",
        level: "1d6",
        use: "Instant",
        description: "An adrenaline jolt eases the action you are taking by three steps."
    },
    {
        id: "STARE_INTO_THE_VAST",
        name: "Stare Into The Vast",
        range: "77-78",
        level: "1d6 + 2",
        use: "Action",
        description: "Stilling your racing thoughts, you regain a number of points equal to this cypher’s level to your Intellect Pool."
    },
    {
        id: "STRANGE_MUSIC",
        name: "Strange Music",
        range: "79-80",
        level: "1d6",
        use: "Action",
        description: "You take a moment to center yourself, and you lose an amount of Stress equal to this cypher’s level."
    },
    {
        id: "TAKING_STOCK",
        name: "Taking Stock",
        range: "81-82",
        level: "1d6 + 2",
        use: "Action",
        description: "Putting together subtle clues and things you’ve seen and learned, you can ask the GM one question and get a general answer. The GM assigns a level to the question, so the more obscure the answer, the more difficult the task. Generally, knowledge that you could find by looking somewhere other than your current location is level 1, and obscure knowledge of the past is level 7."
    },
    {
        id: "THOUGHT_FOR_THE_DAY",
        name: "Thought For The Day",
        range: "83-84",
        level: "1d6",
        use: "Action",
        description: "You remember a pertinent detail regarding the current situation. The detail must be something that can be learned by normal research."
    },
    {
        id: "THRILL_OF_THE_CHASE",
        name: "Thrill Of The Chase",
        range: "85-86",
        level: "1d6",
        use: "Action",
        description: "The situation demands haste. For one minute, you can move a long distance instead of a short distance as an action."
    },
    {
        id: "TIGHTROPE",
        name: "Tightrope",
        range: "87-88",
        level: "1d6 + 2",
        use: "Action",
        description: "Galvanized by your plight, you add 1 to your Speed Edge for one hour (or 2 if the cypher is level 5 or higher)."
    },
    {
        id: "UNCANNY_VALLEY",
        name: "Uncanny Valley",
        range: "89-90",
        level: "1d6 + 3",
        use: "Instant",
        description: "After talking with someone for at least a couple of rounds, you have a better understanding of what they would need to hear to find your deception or persuasion more believable and/or credible, easing a deception or persuasion task by three steps."
    },
    {
        id: "WATCHER’S_KNOW-HOW",
        name: "Watcher’S Know-How",
        range: "91-92",
        level: "1d6",
        use: "Action",
        description: "You know where to look or who to ask to find a significant piece of information. The GM might provide multiple options. This can be used when you start research or while you’re searching for clues. For example, if you want to know if anyone’s been in an apartment in the past 24 hours, the GM might say that you can look at the carpet to see if it’s trodden upon, or that you can speak to the building manager to view the footage from the security cameras in the hallway."
    },
    {
        id: "WEAVER’S_ENCOURAGEMENT",
        name: "Weaver’S Encouragement",
        range: "93",
        level: "1d6",
        use: "Action",
        description: "Your encouraging words and presence motivate someone next to you, granting them an asset on their next task. You encourage up to three characters at once if this cypher’s level is 5 or higher."
    },
    {
        id: "WELL-BEING",
        name: "Well-Being",
        range: "94-95",
        level: "1d6",
        use: "Action",
        description: "You’re jacked up on a cocktail of fear and adrenaline. For one round per cypher level, you can act as if one step higher on the damage track than you actually are, as long as you are not dead."
    },
    {
        id: "WHAT_WE_ALL_IGNORE",
        name: "What We All Ignore",
        range: "96-97",
        level: "1d6",
        use: "Action",
        description: "Determined not to let things get to you, for one hour per cypher level, you reduce the Stress you suffer from mental shock or despair by 1 each time it occurs. You still suffer Stress from physical injury normally."
    },
    {
        id: "WHAT_WE_LOSE",
        name: "What We Lose",
        range: "98-99",
        level: "1d6 + 3",
        use: "Instant",
        description: "You brush past someone, coming away with something from their pocket, bag, or other container, assuming they’re carrying anything. This cypher eases a pickpocketing task by two steps, or four steps if the cypher is level 7 or higher."
    },
    {
        id: "WORDS_OF_THE_PUPPETEER",
        name: "Words Of The Puppeteer",
        range: "0",
        level: "1d6",
        use: "Instant",
        description: "Determined not to fail, you gain an additional asset for any one task involving verbal interaction, even if that means exceeding the normal limit of two assets"
    },

]