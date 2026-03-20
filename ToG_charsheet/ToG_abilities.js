/* 
^([^:]*?)\s*:\s*
(.*\n){2} 
*/

/* 
Abilities that use beads automatically use shinsu.
 */


var conditions = [{
    name: "Hindered",
    description: "if you are Hindered on any roll, you only get half as many dice on that roll as normal. If you would have any automatic successes, you only get half of those as well. Round down in both cases. Apply this reduction after any flat bonuses or penalties. If multiple effects would make you Hindered on a roll, you only apply it once."
}, {
    name: "Slowed",
    description: "While Slowed, you are Hindered on Brawl, Throw, and Move rolls."
}, {
    name: "Pinned",
    description: "While Pinned, you can't move and are Hindered on all Agility rolls."
}, {
    name: "Paralyzed",
    description: "While paralyzed, you can't move, automatically fail all Might and Agility rolls, can't speak, and are Hindered on all rolls."
}, {
    name: "Blind",
    description: "In areas of total darkness, or any other situation where you can't see your targets, you automatically fail any Throw rolls. You are also Hindered on Finesse, Move, and Brawl rolls."
}, {
    name: "Impaired",
    description: "While Impaired, you reduce your dice for a certain type of roll by some amount. For example, if you were Impaired 3 on Agility rolls, you'd have 3 fewer dice on all Agility rolls. If this would reduce your total dice to or below 0, you automatically fail that roll. If multiple effects would make you Impaired on a roll, add them together to find the total effect."
}, {
    name: "Fragile",
    description: "You have at least as many Injuries as 90% of your Might (rounded up). Any strenuous actions cause you to accept an Injury."
}, {
    name: "Dying",
    description: "You have as many Injuries as your Might. You have a number of minutes equal to your Might Edge before you die. Each Injury taken while Dying reduces this countdown by five seconds."
}, {
    name: "Weakened",
    description: "You have at least as much Fatigue as 90% of your Agility (rounded up). You are Hindered on Might and Agility rolls. Any strenuous actions cause you to accept a Fatigue and an Injury."
}, {
    name: "Anxious",
    description: "You have at least as much Confusion as ¾ of your Wits (rounded up). You are Hindered on Heart rolls."
}, {
    name: "Volatile",
    description: "You have at least as much Stress as 90% of your Heart (rounded up). Using shinsu causes you to accept one Stress."
}]


var fisherman_startAbilities = []
var lightbearer_startAbilities = ["LIGHTHOUSE"]
var scout_startAbilities = ["OBSERVER"]
var spearbearer_startAbilities = ["THROWER"]
var wavecontroller_startAbilities = ["BEADS"]
var human_startAbilities = ["TRAINED", "CLIMBER", "WHY_WE_KEEP_GOING", "SAVINGS"]
var crocodile_startAbilities = ["TOUGH", "BIG", "SHARP", "LIVE_TO_HUNT", "DOESNT_HUNT_MONEY"]
var canine_startAbilities = ["BORN_FIGHTER", "IMPLANTED_WEAKNESS", "NOT_DOWN_YET", "TRANSFORMATION", "SINK_OR_SWIM"]
var silverdwarf_startAbilities = ["THE_PATH_FORWARD", "PATHFINDER", "SUPPORT_OF_YOUR_PEOPLE"]
var redwitch_startAbilities = ["WHERE_FATE_LEADS", "GUIDE", "GIFTS"]
var noble_startAbilities = ["NEPOTISM", "ALLOWANCE", "FROWNED_UPON", "BLOODLINE", "YOU_HAVE_YOUR_PARENTS'_FIRE", "MAKING_THE_FAMILY_PROUD", "WEALTH"]
var heir_startAbilities = ["ROYAL_BLOOD", "COMPETITION", "RICH"]
var irregular_startAbilities = ["LEARN_BY_DOING", "SHAKE_THE_FOUNDATIONS_OF_THE_TOWER", "RAPID_GROWTH", "SURPRISINGLY_DURABLE", "ENTER_ALONE", "STARTING_SMALL"]
var keene_startAbilities = ["COLD-HEARTED"]
var trumbald_startAbilities = ["CRAFTER"]
var haas_startAbilities = ["STRONGEST_BODY"]
var lemarque_startAbilities = ["CAPTURE"]
var halleck_startAbilities = ["MADE_OF_GRANITE"]
var posada_startAbilities = ["ANALYSIS"]
var aven_startAbilities = ["FAMILY_SWORDSMANSHIP"]
var yanetta_startAbilities = ["SHROUDED_IN_FLAME"]

var exp_triggers = [
    {
        source: "human",
        trigger: `Climber: Whenever you go up a floor, you gain experience equal to half the floor (round down). 
        Why We Keep Going: You have a dream of some sort. Whenever you make progress towards this dream (other than going up the tower), gain experience equal to the highest floor you've reached. You can change your dream up to once per floor. When you do, you don't gain any experience the next time you make progress towards your dream. Changing your dream causes you to gain one Exhaustion. If you achieve your dream, you retire permanently.` },
    {
        source: "crocodile",
        trigger: `Live to Hunt: Each time you fight a single opponent (i.e. fighting multiple at once does not qualify), you gain experience equal to half their highest attribute (rounded down). This only applies once per person per month.`
    },
    {
        source: "canine",
        trigger: `Not Down Yet: Every time you become Fragile (maximum once per day) or gain an Exhaustion or Trauma, you gain experience equal to the highest floor you've reached. Additionally, taking strenuous actions while Fragile does not cause you to gain an Injury. You can continue to act normally while Dying; any strenuous actions while Dying still cause you to accept an Injury. You are immune to any instant-death effects of Called Shots.`
    },
    {
        source: "silverdwarf",
        trigger: `Pathfinder: Whenever you help someone find the correct path or help them with their journey, gain experience equal to their highest attribute minus the greatest type of Harm they currently have (minimum 1). This can only apply once per person per floor.`
    },
    {
        source: "redwitch",
        trigger: `Guide:  Whenever you guide someone where they need to go, and whenever a Regular changes their Dream because of you (directly or indirectly), gain experience equal to the total number of Harms they have. Calculate this after the Regular takes the Exhaustion for changing their Dream. Whenever someone takes Exhaustion or Trauma, or enters Weakened, Fragile, Anxious, or Volatile status because of advice or help you gave, gain experience equal to the Harms they have.`
    },
    {
        source: "irregular",
        trigger: `Learn By Doing: When you are hit by a shinsu attack, you can choose to treat the damage from that as Unresisted and gain experience equal to the Harm you take. 
        Shake the Foundations of the Tower: Whenever you shake the status quo, you gain experience:
              - Equal to the current floor for a tiny or temporary change.
              - Equal to twice the current floor for a significant and long-lasting change.
              - Equal to three times the current floor for a total upheaval.` },
    {
        source: "keene",
        trigger: `Whenever you manipulate someone into helping you, you gain experience equal to their Wits.`
    },
    {
        source: "trumbald",
        trigger: `Whenever you make an item, you get one experience, plus one for every five hundred credits that item costs.`
    },
    {
        source: "haas",
        trigger: `Whenever you intentionally disobey someone with authority over you, you gain experience equal to their lowest attribute. This only applies once per person.`
    },
    {
        source: "lemarque",
        trigger: `Whenever you capture a divine fish, you gain experience equal to the current floor.`
    },
    {
        source: "halleck",
        trigger: `Whenever you reduce the Damage Base or total damage of an attack against you to 1 or less, gain experience equal to your Resistance, with a maximum of once per day.`
    },
    {
        source: "posada",
        trigger: `Whenever you uncover some significant, new piece of information that isn't commonly known (as determined by the GM), you gain an amount of experience: equal to the highest floor you've reached for information that is known only to High Rankers or other very important people; equal to twice that floor for information that is only known by a handful of people in the Tower; equal to five times that floor for information that isn't known by anyone else in the Tower.`
    },
    {
        source: "aven",
        trigger: `Whenever you kill someone who wasn't a threat to you (or otherwise didn't need to die), gain experience equal to the highest floor you've reached.`
    },
    {
        source: "yanetta",
        trigger: `When you pick this family, choose one of the following to be your experience trigger for this family. You can't change your decision later. Both only apply once per person per day.
        Whenever you heal someone of Injuries equal to or greater than their Might Edge, gain experience equal to their Might.
        Whenever you cause someone to take Injuries equal to or greater than half their Might, gain experience equal to their Might Edge.` }
]



var universal_abilities = [{
    name: "Beads",
    id: "BEADS",
    description: "You can create any number of beads, though you can only control a number equal to twice your Heart Edge. This does not require an action, but can only be done on your turn. Abilities marked with [Extended] involve an extended effect, and the beads used still count against your maximum controlled. You can accept an amount of Stress to:\n Ignore the limit on beads controlled for one Stress per round per bead.\n Create beads on somebody else's turn, at the cost of two Stress per bead. If you accept three additional Stress per bead, you can then use a single ability that uses beads and would normally require your action.",
    source: "any",
    type: "universal",
    shinsu: true
}, {
    name: "Flight",
    id: "FLIGHT",
    description: "You can “swim” through the shinsu, effectively flying. You can only do this when your Heart is greater than one-fifth the current floor. You need to use a bead to begin using this ability, but not to continue using it. While flying in this way, you are Hindered on Brawl and Move rolls.",
    source: "any",
    type: "universal",
    shinsu: true
}, {
    name: "Shinsu Reinforcement [Extended]",
    id: "SHINSU_REINFORCEMENT_[EXTENDED]",
    description: "You can use one bead and, for two rounds, act as though your Agility and Might were increased by an amount equal to your Heart. Using this requires an action. The bonus increases those attributes for all purposes, including bonus dice, automatic successes, Edges, and your maximum Injuries and Fatigue. By accepting Stress, you can increase the duration by one round per Stress. You can accept Stress to extend the duration on other rounds, not just the first; doing so does not require an action. Additionally, you can accept one Stress (per round) to instead act as though your Agility and Might were increased by twice your Heart instead. By using one additional bead (but without accepting any additional Stress), you can additionally reinforce one object you're holding to let it function as a weapon. This lasts for up to one round after you let go of it or until the entire effect ends, whichever comes first. While you're reinforcing the object, it has Structure and Toughness equal to half your Heart and acts as an appropriate weapon for all purposes (discuss with your GM what weapon would be appropriate).",
    source: "any",
    type: "universal",
    shinsu: true
}, {
    name: "Superhuman Speed",
    id: "SUPERHUMAN_SPEED",
    description: "While you're boosted by Shinsu Reinforcement, you can accept an amount of Fatigue equal to twice your Agility Edge to take two actions in the same round. In order to buy this ability, your Agility must be at least 50.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Superhuman Strength",
    id: "SUPERHUMAN_STRENGTH",
    description: "While you're boosted by Shinsu Reinforcement, you can accept a number of Injuries equal to twice your Might Edge to perform a feat of strength. Until the end of your turn, you make any Might-based rolls with three times as many dice. In order to buy this ability, your Might must be at least 50.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Give it Everything",
    id: "GIVE_IT_EVERYTHING",
    description: "Once per week, you can accept one Exhaustion to briefly ignore your wounds. For the next thirty seconds (three rounds of combat), you cannot die by any means. Additionally, during that time being Weakened or Anxious does not Hinder your rolls and exceeding your limits on any type of Harm does not cause you to faint, collapse, break down, or die. After the round is over, you experience all the normal consequences of having Exhaustion, as well as any other Harm you may have accumulated.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Long Life",
    id: "LONG_LIFE",
    description: "Exposure to shinsu and the conditions in which you've trained have kept you from aging. You cannot take this ability unless you have an attribute that's at least 50.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Compression",
    id: "COMPRESSION",
    description: "Either by making a contract with the Administrator, or by using your own power, you can reduce your size or the size of your possessions. This is generally used when you or your weapons are too big to fit in most structures. Compressing yourself or an item requires a minute of concentration. Reversing this does not take an action. If applied to an object, anyone can reverse the effect, even without this ability. While compressed, you are Hindered on all Might rolls. Compressing a crocodile causes them to lose the Big ability while compressed. This ability uses shinsu.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Up Close and Personal",
    id: "UP_CLOSE_AND_PERSONAL",
    description: "When you buy this ability, you can get any one of the following abilities at no extra cost:\nDisarm (Fisherman), Counterattack (Fisherman), Flurry (Fisherman), Support Fighter (Scout), or Opening (Scout). You can only buy this ability twice.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Heal",
    id: "HEAL",
    description: "You can use any number of beads to repair a person's body. Each bead heals them of Injuries equal to your Heart Edge, or Fatigue equal to half your Heart Edge (rounded down). This requires ten seconds (one round of combat) per bead, but does not require an action. If you have the Magnify ability, you can increase the effectiveness of each round of healing—by using three beads, you can apply the healing benefits of two of them in one round. The additional bead cost increases linearly; tripling the effective healing speed requires five beads total, quadrupling requires seven beads total, etc. For the math nerds, the cost of healing with speed X is equal to 2X-1.",
    source: "any",
    type: "universal",
    shinsu: true
}, {
    name: "Dual Training",
    id: "DUAL_TRAINING",
    description: "When you're wielding two or more weapons at once, add a number of dice equal to your Might Edge or Agility Edge to all attack rolls. This applies before calculating the effects of Hindered.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Many-Weapon Training",
    id: "MANY-WEAPON_TRAINING",
    description: "When you're wielding more than two weapons at once, your attacks are Hindered and Impaired equal to the total number of attacks, instead of the normal penalty. You must have Dual Training to get this ability.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Titan's Grip",
    id: "TITANS_GRIP",
    description: "You can wield a two-handed weapon in one hand without penalties, as though it was a one-handed weapon.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Sharp as Broken Glass",
    id: "SHARP_AS_BROKEN_GLASS",
    description: "When your mind broke, the edges were left sharper. Increase your Edges by the number of Traumas you have. \nIt's not a good idea to refer to any traumatized person as broken. If you feel like you're broken, please find a therapist.",
    source: "any",
    type: "universal",
    shinsu: false
}, {
    name: "Called Shot",
    id: "CALLED_SHOT",
    description: "Before you make a Brawl roll, Throw roll, or roll with the Shot ability (or any other ability that seems applicable), you can reduce your total dice by some amount to target a specific part of your enemy or their person. The penalty amount increases with the target's Tier. If you hit, you resolve the roll as normal and may also cause your enemy to suffer an additional effect. If you're using Rapid Shot, Shot, or another ability that allows you to make multiple attacks on separate targets, you can use these attacks to target multiple parts of the same enemy. \nArm: -(Tier) dice. The enemy is Hindered on Brawl rolls with that arm for the next two rounds. \nChest: -(Tier) dice. The enemy is Hindered on Agility rolls for the next two rounds. \nEye: -(5*Tier) dice. The enemy is Blinded for the next two rounds. \nHand: -(3*Tier) dice. The enemy is disarmed and is Hindered on Brawl rolls with that hand for the next two rounds. \nHead: -(3*Tier) dice. The enemy is Hindered on Wits rolls for the next two rounds. \nHeart: -(5*Tier) dice. The enemy takes additional Unresisted Injuries equal to their Might Edge. If your attack would leave them Fragile or worse, they die. \nLeg: -(Tier) dice. The enemy is Slowed for the next round unless they are flying. \nNeck: -(5*Tier) dice. The enemy can't speak for the next two rounds. If your attack would cause them to take at least as many Injuries as half their Might (after applying Resistance and other reductions), they die. \nVitals: -(3*Tier) dice. The enemy is Hindered on all rolls for the next round. \nArmor/Shield: -(Tier) dice. The enemy can't attempt to block this attack. \nWeapon: -(2*Tier) dice. The enemy can attempt to block this, but must choose another item to take the attack instead.",
    source: "any",
    type: "universal",
    shinsu: false
}]
var shinsu_abilities = [{
    name: "Shinsu Quality (Lightning)",
    id: "SHINSU_QUALITY_[LIGHTNING]",
    description: "If you deal any amount of Harm to a Lighthouse, Observer, or other electrical device (GM has the final say on what counts), it overloads and stops functioning for the next round.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Lightning Strike",
    id: "LIGHTNING_STRIKE",
    description: "You can use two beads and accept Stress and Confusion equal to your Heart Edge and Wits Edge, respectively, to throw a spear made of lightning. You don't need a physical spear to make this attack. You can't use this attack with the abilities Called Shot, Rapid Shot, Impale, Critical Shot, or Disabling Shot. You can't use stunts with this attack except to deal additional Harm. All Harm caused by this attack is Unresisted. Attempts to dodge this attack are Hindered.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Chain Lightning",
    id: "CHAIN_LIGHTNING",
    description: "You can use one or more beads to target a point within Short range; a number of enemies within Close range less than or equal to twice the number of beads used take Injuries equal to half your Heart minus half their Resistance.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Bolt Rider",
    id: "BOLT_RIDER",
    description: "You can use a bead and take two Stress and Fatigue to move to any location you could reach in a straight line without hitting any solid objects. This uses either your movement or your action. You cannot use this more than once per round. Any attempts to sneak while using this are Hindered.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Shinsu Quality (Wind)",
    id: "SHINSU_QUALITY_[WIND]",
    description: "You do not need to use a bead to use the Flight ability, and using it doesn't require an action. Flight still uses shinsu. Additionally, you are not Hindered on Brawl or Move rolls while airborne.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Whirlwind [Extended]",
    id: "WHIRLWIND_[EXTENDED]",
    description: "You can use any number of beads to create a whirling wall of air around you that deflects almost any projectile. Whenever you're being targeted by a ranged attack, you can roll against it. You make this roll with as many dice as twice the number of beads you used. This lasts until the end of your next turn, and requires an action.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Gust",
    id: "GUST",
    description: "You can use any number of beads to create a gust of wind. The wind is a line as wide as you that extends until it hits a large, solid object (to a maximum range of Short). Creatures that are hit by the gust take one Injury and one Fatigue for every three beads you use (reduced by their Resistance Edge, minimum one), and are Impaired by a number equal to the number of beads you use on all rolls for the next round.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Still and Stir the Air",
    id: "STILL_AND_STIR_THE_AIR",
    description: "You can use a bead to manipulate the air currents around you within Short range. Depending on what you wish, you can amplify sounds and scents, or instead negate them.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Shinsu Quality (Ice)",
    id: "SHINSU_QUALITY_[ICE]",
    description: "Any of your abilities that would slow enemies instead pin them for the first round and slow them for the rest of the duration.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Ice Rink",
    id: "ICE_RINK",
    description: "You can use any number of beads to create a circular ice rink on the ground around you in Short range. It lasts for one round. While touching the ground, anyone who does not have the ice shinsu quality is Impaired on Move and Brawl rolls by a number equal to the number of beads you used and takes Fatigue equal to the number of beads you used minus their Resistance Edge at the start of each of their turns. This takes your action.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Polar Midnight",
    id: "POLAR_MIDNIGHT",
    description: "Cool the area within Close range. This takes an action. All water freezes, everyone who isn't you takes three times your Heart Edge in Fatigue (reduced by their Resistance Edge), and all metallic objects become too cold to safely touch without protection. Anyone holding one takes Unresisted Injuries equal to three times your Heart Edge unless they drop the object.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Frozen Grapeshot",
    id: "FROZEN_GRAPESHOT",
    description: "You can use an action and a bead to fire off a blast of razor-sharp shards of ice. Enemies in a cone within Close range take Injuries and Fatigue equal to twice your Heart Edge. Creatures in the area can attempt to dodge this, rolling against your Attune (if more than one creature is dodging, roll Attune once and compare that to all dodge rolls). If they successfully dodge, they instead take Injuries and Fatigue equal to your Heart Edge. Regardless, they reduce both types of incoming Harm by their Resistance Edge (minimum 1).",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Shinsu Quality (Fire)",
    id: "SHINSU_QUALITY_[FIRE]",
    description: "Whenever you would make an enemy take any number of Injuries, you also give them half that many Unresisted Injuries (rounded down) on their next turn. Calculate based on the post-mitigation Injuries. This does not apply to Injuries dealt by this ability. If you're underwater or in some other fire-resistant environment, this effect is negated (subject to GM interpretation).",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Inferno [Extended]",
    id: "INFERNO_[EXTENDED]",
    description: "You can use any number of beads to create a massive ball of flames, melting or incinerating just about everything nearby. On your first turn while using this ability, you cause all enemies within Short range to take Injuries equal to the number of beads used. On your second turn, the damage increases to be equal to twice the number of beads used. This continues until you're dealing damage equal to your Heart Edge per bead. You have to use your action each turn that you use this. If you already have this ability in use, you can add beads to it without using an action, which increases the damage.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Fireball",
    id: "FIREBALL",
    description: "You can use any number of beads to create a small ball of fire that flies towards an area and explodes. It travels in a straight line and explodes when it hits any solid barrier or when it reaches its maximum range. Its maximum range is Medium. When it explodes, it deals two Injuries per bead to all creatures within Close range of it. The creatures can attempt to dodge this, rolling against your Attune (if more than one creature is dodging, roll Attune once and compare that to all dodge rolls). If they successfully dodge, they instead take one Injury per bead. The damage in both cases is reduced by their Resistance Edge (minimum one). This takes your action.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Flare [Extended]",
    id: "FLARE_[EXTENDED]",
    description: "You can use one or more beads to create a light in a location within Close range. That light brightly illuminates the surrounding area out to Close range. If the light covers at least Short range, it is especially bright in closer areas. Everything in the range increments below its illumination range is revealed. All rolls to hide or sneak within that area are Hindered. This has no effect on invisible things. For example, if the light illuminates everything up to Long range, it reveals things up to Medium range. It lasts until dispelled or until you want the bead(s) back. If you have the Magnify ability and double the bead cost, you can overcharge the light, creating a bright flash capable of blinding people inside the area. Anyone inside the light's total area who doesn't intentionally avert their eyes (you are assumed to do so) is Blinded for the next round. The duration of the Blinded effect can't be increased.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Shinsu Quality (Rock)",
    id: "SHINSU_QUALITY_[ROCK]",
    description: "Whenever someone makes a contested roll against one of your attributes, increase that attribute's Edge by half (rounded down). If this is dispelled, it returns at the end of your next turn.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Stone Skin",
    id: "STONE_SKIN",
    description: "By taking one Stress per round (in addition to any other sources of Stress), Shinsu Reinforcement increases your Resistance by half of your Heart.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Toughness",
    id: "TOUGHNESS",
    description: "Attacks that target you have a minimum Damage Base of 0.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Closed Mind",
    id: "CLOSED_MIND",
    description: "You know what you're here to do, and you don't get distracted easily. You reduce any Confusion that you would take by your Resistance Edge, similar to Fatigue. If this is dispelled, it returns at the end of your next turn.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Shinsu Quality (Water)",
    id: "SHINSU_QUALITY_[WATER]",
    description: "As long as you would get at least one automatic success on a roll, you get additional automatic successes on that roll equal to your Tier. If you would not, you instead get bonus dice on that roll equal to your Tier. If this is dispelled, it returns at the end of your next turn.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Crashing Wave",
    id: "CRASHING_WAVE",
    description: "You can use one bead to shove an opponent around at range. You make an Attune roll and treat it as a Brawl roll. You need to be able to see your target. This has a maximum range of Medium. You don't get any bonuses that apply only to Brawl rolls or that apply only to weapon attacks. For this attack, your Damage Base is equal to half your Heart Edge (round up).",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Maelstrom [Extended]",
    id: "MAELSTROM_[EXTENDED]",
    description: "You can use any number of beads to create a whirling tempest of water around you. This has a radius of Short, and all creatures in the area (except you) take one Injury and Fatigue every round for each bead you use, as well as being Hindered on Move, Think, Finesse, and Throw rolls. This requires your action to start and to maintain, and you take one Stress every round it's active. Reduce the Harm dealt by each target's Resistance Edge.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Purify Body",
    id: "PURIFY_BODY",
    description: "Whenever you would be affected by the Heal ability, or whenever you would use the Heal ability on another (including through wands), you heal 50% more (rounded up).",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Shinsu Quality (Steel)",
    id: "SHINSU_QUALITY_[STEEL]",
    description: "While wielding a weapon, you get +2 dice on Brawl rolls and take 2 fewer Injuries, Fatigue, Confusion, and Stress from all sources (to a minimum of 0). This does apply to Unresisted Harm. This does not apply to Harm you willingly accept as part of an ability. Apply this after calculating total damage from the source; do not apply this to the Damage Base. If this is dispelled, it returns at the end of your next turn.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Placeholder",
    id: "PLACEHOLDER",
    description: "nothing",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Armed and Ready",
    id: "ARMED_AND_READY",
    description: "You can never be disarmed. Double the Toughness and Structure of any weapon, armor, Inventory, or reel you're wielding. If this is dispelled, it returns at the end of your next turn.",
    source: "any",
    type: "shinsu",
    shinsu: true
}, {
    name: "Armor Storm",
    id: "ARMOR_STORM",
    description: "You can use your armor (including shield and armor inventories) offensively. At any time, including on somebody else’s turn, you can choose to start using your armor as a weapon. From that point until you choose to stop using it as a weapon (which can only be done on your turn), any rolls you make to block with it are Hindered and any rolls you make to attack with it gain bonus dice equal to half the dice it would normally grant (rounded down). If your armor does not normally grant dice to Block rolls, and functions some other way, then work with your GM to decide how to reduce the defensive powers of your armor (as a guideline, its defensive powers should be reduced by about half) and how to grant it offensive powers. You cannot switch between using your armor as a weapon and using it as armor more than once per turn (i.e. on a given turn, you can only stop using it as a weapon or start using it as a weapon).",
    source: "any",
    type: "shinsu",
    shinsu: true
}]
var fisherman_abilities = [{
    name: "Weapon Skills (Hook)",
    id: "WEAPON_SKILLS_[HOOK]",
    description: "While wielding a hook, you can use two stunts on a Brawl roll to stab your enemy and hold them in place. While they're held, they are Pinned unless they pull it out (requiring a Brawl roll against your Brawl) or tear it out, which causes them to take Unresisted Injuries equal to your Might Edge. Additionally, while you have them held you gain the following stunts for Brawl: pull your enemy anywhere within your reach; and twist the hook to make them Hindered on Wits and Heart rolls for the next round (using this stunt more than once doesn't increase its effects or duration in any way). While holding an enemy in this way, you can't use stunts to deal additional Harm with the hook.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Weapon Skills (Needle)",
    id: "WEAPON_SKILLS_[NEEDLE]",
    description: "While wielding a needle, you can accept two Fatigue to make two melee attacks with one action. For every five dice you have to Brawl (not including automatic successes), you can accept another two Fatigue to make another attack in this way. You have to declare that you're doing this (and how many attacks you're making) before you start making attacks.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Weapon Skills (Blade)",
    id: "WEAPON_SKILLS_[BLADE]",
    description: "While wielding a blade, you can hit additional enemies with the same roll. Each enemy has to be within your reach. You take two Fatigue for each enemy past the first attacked in this way.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Weapon Skills (Bludgeon)",
    id: "WEAPON_SKILLS_[BLUDGEON]",
    description: "While wielding a blunt weapon, you can use Brawl stunts to knock an enemy down or back. Knocking an enemy down requires two stunts; that enemy is considered Slowed until the start of their turn. Knocking an enemy back requires two stunts to move them to Close range, six stunts to move them to Short range, fourteen stunts to move them to Medium range, and thirty stunts to move them to Long range. If they hit a solid barrier, or otherwise end their movement, they take 1d6 Injuries for every stunt used this way (e.g. moving them to Short range means they take 6d6 Injuries).",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Weapon Skills (Unarmed)",
    id: "WEAPON_SKILLS_[UNARMED]",
    description: "While you aren't wielding any other weapons (except gauntlets, handwraps, or other minimal weapons), blocking bare-handed does not cause you to take damage. If you block a ranged weapon bare-handed, you can catch any projectiles involved. This negates the effects of Rebound, if applicable. You can choose to attack as though you were dual wielding or using any additional number of weapons.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Disarm",
    id: "DISARM",
    description: "With two stunts and by accepting two Injuries on a Brawl attack, you can knock an enemy's weapon out of their hands. It flies in a random direction and lands within Close range. That enemy can retrieve it on their turn. If your enemy has more than one weapon, you can use additional stunts and accept additional Injuries to disarm them of multiple weapons.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Bruiser",
    id: "BRUISER",
    description: "Add a number of dice equal to your Might Edge to your Brawl rolls.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Damage Sponge",
    id: "DAMAGE_SPONGE",
    description: "You can accept one Stress and one Confusion to heal yourself of a number of Injuries equal to your Might Edge. You cannot use this while Dying. You can only use this once per turn.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Reel",
    id: "REEL",
    description: "You can use a reel, a length of cord or cable that attaches to one end of your weapon. By using shinsu to stiffen or manipulate the line, you can control the weapon almost like you were holding it. While using a reel, you can use Brawl (and any associated stunts) at range, though you are Hindered on these rolls. The Reel has a maximum range of Medium.",
    source: "position",
    type: "fisherman",
    shinsu: true
}, {
    name: "Defender",
    id: "DEFENDER",
    description: "When one of your allies in your reach is about to get attacked, you can choose to throw yourself in front of the attack and willingly take that hit instead of them. You can't choose to dodge or avoid the attack—however, you can attempt to block it. You have to see the attack coming in order to do this.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Unmoving",
    id: "UNMOVING",
    description: "If an enemy's attack would move you from your position, knock you down, or in any other way move you against your will, you can accept one Injury instead.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Counterattack",
    id: "COUNTERATTACK",
    description: "When struck by a melee attack, you can choose to double the initial Damage Base of the attack (before applying either Resistance or effects like the Crocodile Regular's Sharp, but after applying any stunts) to make an immediate counterattack against the enemy that hit you. You cannot apply the effects of any Weapon Skills, Sunder, Opening, Flurry, dual wielding, or Called Shot to this attack. This does not apply to an attack you block. If you have Bloodied Berserker or any similar ability, calculate your attack before applying damage from the enemy's attack.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Reserves of Strength",
    id: "RESERVES_OF_STRENGTH",
    description: "By taking two Confusion and Stress per round, you can ignore the effects of the Weakened and Fragile conditions.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Flourish",
    id: "FLOURISH",
    description: "Your stylish attacks inspire your allies. You can take one Confusion to treat a Brawl attack as though it was a Reach Out roll that gets half as many successes. It still counts as a Brawl roll for attacking an enemy.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Challenger",
    id: "CHALLENGER",
    description: "On your turn, you can make a Manipulate roll (with a number of bonus dice equal to your Resistance Edge) against an enemy's Wits to force them to exclusively attack you for one minute (six combat rounds). If you fail this roll, you take an amount of Confusion equal to your Might Edge. This does not require your action.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Living Wall",
    id: "LIVING_WALL",
    description: "Whenever an enemy attempts to move past you and passes through your melee range, you can take two Fatigue and make an attack against them. If you hit, they must immediately end their movement. You cannot apply the effects of Weapon Skills, Sunder, Opening, Flurry, dual wielding, or Called Shot to this attack.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Bloodied Berserker",
    id: "BLOODIED_BERSERKER",
    description: "When making a Brawl roll, add half the number of Injuries you currently have to your Might for the purposes of determining the number of dice you roll and the damage you deal.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Flurry",
    id: "FLURRY",
    description: "If you hit with a melee attack, you can accept two Injuries to immediately make another attack, which is Impaired 2 and has -1 automatic success. You can keep this up as long as you keep hitting and taking Harm. The penalties stack for each attack.",
    source: "position",
    type: "fisherman",
    shinsu: false
}, {
    name: "Overwhelming Force",
    id: "OVERWHELMING_FORCE",
    description: "In order to buy this ability, either your Might or Resistance must be at least 50. When you make a Brawl roll, reroll all 1s. You may reroll them as many times as necessary to stop rolling 1s.",
    source: "position",
    type: "fisherman",
    shinsu: false
}]
var lightbearer_abilities = [{
    name: "Lighthouse",
    id: "LIGHTHOUSE",
    description: "You can use a Lighthouse, a small floating cube with a variety of functions. Which functions are available is affected by the rank of the Lighthouse. You can control a number of Lighthouses at one time equal to your Wits Edge. You can only control a Lighthouse as long as it stays within a certain range, which varies depending on the rank. The Lighthouse has an Agility equal to its controller's Wits. Any rolls you make using a Lighthouse receive bonus dice for each Lighthouse you use. The number of bonus dice depends on the rank of the Lighthouse.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Brains",
    id: "BRAINS",
    description: "Add your Wits Edge to your Think rolls.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Smooth Talker",
    id: "SMOOTH_TALKER",
    description: "Add your Wits Edge to your Manipulate rolls.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Calculator",
    id: "CALCULATOR",
    description: "Your Lighthouses can add half their dice bonus (rounded down, minimum 1 per Lighthouse) on any of your Think rolls.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Lighthouse Flow Control",
    id: "LIGHTHOUSE_FLOW_CONTROL",
    description: "With a Think roll against an enemy's Resistance, you can temporarily slow or pin them. With one success over their Resistance, you Slow them for one round. You can use a stunt to increase the duration by a round. Alternatively, you can use three times as many stunts (three as the base, plus three for each round past the first) to instead pin them for the duration. This uses your action. The enemy must be within Short range of one of your Lighthouses. This ability uses shinsu.",
    source: "position",
    type: "lightbearer",
    shinsu: true
}, {
    name: "Emerald Sword",
    id: "EMERALD_SWORD",
    description: "You use the Lighthouse to gather shinsu around a melee weapon, boosting its power. Roll Think and add as many successes as you roll to the next attack with that weapon. For each round that passes between using this ability and making the attack, the number of successes decreases by one (minimum 0). This ability does not stack with any other uses of Emerald Sword; only the use that would grant the most successes remains. Using this ability requires your action. This ability uses shinsu.",
    source: "position",
    type: "lightbearer",
    shinsu: true
}, {
    name: "Lighthouse Teleportation",
    id: "LIGHTHOUSE_TELEPORTATION",
    description: "You can accept one Confusion to teleport up to one person (or a similar mass of objects) between two Lighthouses you control. This requires an action. The person must be close enough to touch the Lighthouse. If the person does not want to be teleported, you make a Think roll against their Resistance and accept two additional Confusion. This ability uses shinsu.",
    source: "position",
    type: "lightbearer",
    shinsu: true
}, {
    name: "Instant Teleport",
    id: "INSTANT_TELEPORT",
    description: "If you have the Lighthouse Teleportation ability, you can accept one additional Confusion (two total) to use the ability without using your action. Additionally, you can accept three additional Confusion (five total) to use the ability on someone else's turn. The cost is then multiplied by the number of times you've used this ability this round (plus one). I.e. if it's the first time you're using it, no multiplier.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Steer",
    id: "STEER",
    description: "You can use one or more Lighthouses to assist a ranged weapon, allowing that weapon's wielder to be much more accurate than they would be otherwise. When an ally makes a Throw roll, you can simultaneously make a Think roll and give all of your successes to your ally. They treat your successes as though they had rolled them. Using this ability gives you Confusion equal to your Wits Edge. You can use this ability when it isn't your turn, but it consumes your next action. This ability uses shinsu.",
    source: "position",
    type: "lightbearer",
    shinsu: true
}, {
    name: "Hack",
    id: "HACK",
    description: "You can use a Lighthouse to hack into a Lighthouse that you don't control. The other Lighthouse must be within the range of yours. To hack it, you make a Think roll against the other Light Bearer's Think. If you win, you gain control of their Lighthouse and can access any data stored inside. This requires one full round of hacking. If they attempt to regain control of their Lighthouse (requiring another full round), they make another contested Think roll.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Unparalleled Insight",
    id: "UNPARALLELED_INSIGHT",
    description: "When speaking with someone and neither of you is in combat, you automatically know if they're lying or hiding something (but not necessarily what), with no roll required.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Light Wall",
    id: "LIGHT_WALL",
    description: "You can take one Confusion per Lighthouse (with a minimum of three) to form a wall with them. This requires your action to make, but not to maintain. The maximum distance between two adjacent Lighthouses is equal to one-tenth the range of said Lighthouses. While the walls between Lighthouses must be straight, the overall structure can have any number of angles—provided you control enough Lighthouses. Each section of wall has a Toughness equal to your Wits Edge and a Structure equal to your Heart Edge, both of which are multiplied by the number of Lighthouses used. While they're creating a wall, you can't use any of those Lighthouses. This ability uses shinsu.",
    source: "position",
    type: "lightbearer",
    shinsu: true
}, {
    name: "Mystery Sphere",
    id: "MYSTERY_SPHERE",
    description: "By using a Lighthouse of at least rank B, your Lighthouse can create a large honeycomb sphere around a single enemy. Using this requires an action. Each of the interior surfaces of this sphere will, when touched, warp the enemy to a random other surface. At the beginning of each of the enemy's turns, roll Think; the Structure of the sphere during that turn is equal to ten times the number of successes on your roll. The Toughness of the sphere is equal to your Wits. Your Lighthouse must be within Close range of the chosen enemy. This ability uses shinsu.",
    source: "position",
    type: "lightbearer",
    shinsu: true
}, {
    name: "Masterful Plan",
    id: "MASTERFUL_PLAN",
    description: "When something goes in an unexpected direction, you can declare that all is going according to plan and flashback to earlier, when you prepared for this by (for example) laying traps, gathering supplies, or in any other way preparing for your current situation.  In order to use this, you accept an amount of Confusion equal to twice your Wits Edge.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}, {
    name: "Overwhelming Mind",
    id: "OVERWHELMING_MIND",
    description: "In order to buy this ability, either your Wits or Heart must be at least 50. When you make a Think roll, reroll all 1s. You may reroll them as many times as necessary to stop rolling 1s.",
    source: "position",
    type: "lightbearer",
    shinsu: false
}]
var scout_abilities = [{
    name: "Observer",
    id: "OBSERVER",
    description: "You can summon a small flying robot called an Observer. You must purchase this Observer before you can use it. You need to use an action to summon the Observer, but not to control it. For the purposes of dodging and taking hits, the Observer has 10 Might and Agility equal to its controller's. This Observer can do the following: \n Record and transmit audio and video to an allied Lighthouse. \n Play recorded audio. \n Spread light in a small cone. \n Support the weight of a small child (maximum ~50 lb or ~20 kg).",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Advanced Observer",
    id: "ADVANCED_OBSERVER",
    description: "Adds the following abilities to the Observer. These abilities can't be used unless you possess an advanced Observer.\n Create a hologram up to human size within Close range. This hologram can move and is virtually indistinguishable from an imitated object or person. This ability can be used in conjunction with the basic ability to play recorded audio. The hologram does not have any physical substance. The hologram fools anyone who observes it unless they attempt to physically touch it.\n Slow creatures in a small cone for one round (this requires your action). The creatures must be within Close range.\n Counter the above slowing ability (this does not need to be done on your turn, but leaves you Hindered on any rolls taken as part of your next action).\n Support the weight of a single person",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Black Fish [Extended]",
    id: "BLACK_FISH_[EXTENDED]",
    description: "You can block the light around you, essentially becoming invisible. This uses your action when you start it, but not to continue using it. This requires using one bead per minute. If you don't have any beads, you can't use this ability. While invisible, sneaking using Finesse does not use an action. Any attempts to detect you are Hindered. Anyone targeting you is treated as Blinded unless they can pinpoint your position (with a successful Think roll), in which case they are Hindered.",
    source: "position",
    type: "scout",
    shinsu: true
}, {
    name: "Sneaky",
    id: "SNEAKY",
    description: "Add your Agility Edge to your Finesse rolls.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Speedy",
    id: "SPEEDY",
    description: "Add your Agility Edge to your Move rolls.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Support Fighter",
    id: "SUPPORT_FIGHTER",
    description: "You can use Agility for Brawl rolls. Damage is still based on your Might Edge.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Opening",
    id: "OPENING",
    description: "You can roll Brawl to force an enemy off-balance. You do not deal damage by default with this roll. Instead, you can give any number of your successes to the next person to attack the enemy before that enemy's next turn.. They treat these successes as though they had rolled them for all purposes. This uses your action.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Feather Foot",
    id: "FEATHER_FOOT",
    description: "By taking one Fatigue per round, you can stand, run, and otherwise move on liquid surfaces.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Spider Foot",
    id: "SPIDER_FOOT",
    description: "By taking two Fatigue per round, you can stand, run, and otherwise move on vertical surfaces or while upside down. You need to have Feather Foot before getting this ability.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "On Guard",
    id: "ON_GUARD",
    description: "If it is physically possible for you to notice a nearby enemy or ambush, you do so. If the enemy or ambusher is within Short range, you don't need to roll. If they're within Medium range, you must still roll Think against their Finesse. If the hiding enemy or ambusher is a Scout or has the Sneaky ability, you must still roll Think against their Finesse. If they're using Black Fish, you are not Hindered on that roll. For every minute that you're around a hiding enemy or ambusher, you can attempt to reroll a failed Think roll you made as part of this ability.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Flow Like Water",
    id: "FLOW_LIKE_WATER",
    description: "When you roll to dodge an attack from an enemy with a lower Agility than your own, you do not take a penalty on later rolls to dodge.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Sneak Attack",
    id: "SNEAK_ATTACK",
    description: "When you attack an enemy that isn't expecting your attack (they must either be unaware of your presence or consider you friendly), your attack deals double damage.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Fall Silently",
    id: "FALL_SILENTLY",
    description: "When you attack an enemy that isn't expecting your attack (they must either be unaware of your presence or consider you friendly), your combat doesn't make any noise until the end of your target's turn (if they survive that long). This is considered a shinsu effect, but does not require a bead.",
    source: "position",
    type: "scout",
    shinsu: true
}, {
    name: "Track",
    id: "TRACK",
    description: "You can look around a space and identify traces of past events. Roll Think; the number of successes you get is equal to the maximum number of hours passed since those events. If you take 5 Confusion, the number of successes you get is instead equal to the maximum number of days since those events. If someone is deliberately attempting to conceal or falsify their tracks, they roll Finesse and subtract their successes from yours.",
    source: "position",
    type: "scout",
    shinsu: false
}, {
    name: "Overwhelming Speed",
    id: "OVERWHELMING_SPEED",
    description: "In order to buy this ability, either your Agility or Wits must be at least 50. When you make a Move roll, reroll all 1s. You may reroll them as many times as necessary to stop rolling 1s.",
    source: "position",
    type: "scout",
    shinsu: false
}]
var spearbearer_abilities = [{
    name: "Thrower",
    id: "THROWER",
    description: "Add either your Might Edge or your Agility Edge to your Throw rolls.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Stabber",
    id: "STABBER",
    description: "When using a spear or ranged weapon in melee, you increase your Brawl by an amount of dice equal to either your Agility Edge or Might Edge. Regardless of which one you choose, you still deal damage according to your Might.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Strong Arms",
    id: "STRONG_ARMS",
    description: "You can use Might for Throw instead of Agility.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Rapid Shot",
    id: "RAPID_SHOT",
    description: "As an action, you can roll Throw and divide your successes between any number of targets. You accept one Fatigue per attack you make with this ability.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Critical Shot",
    id: "CRITICAL_SHOT",
    description: "As an action, you can make a single ranged attack that deals double damage. When you use this, you accept an amount of Fatigue equal to your Agility Edge.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Aim",
    id: "AIM",
    description: "As an action, you can take careful aim. Your next Throw roll before the end of your next turn is made with twice as many dice as normal. This does not double any automatic successes you might have. If an effect would make you Hindered on a Throw roll, this negates that Hindered effect instead.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Get Over Here",
    id: "GET_OVER_HERE",
    description: "With a lucky throw, you can snag your target and pull them towards you. If you have a reel and a weapon with projectiles at least the size of an arrow, you can attach the reel to a projectile and fire it at an enemy. This is a normal Throw attack with no other modifiers, but cannot be used with Rapid Shot, Bending Spear Technique, or Called Shot. You can then use stunts to pull the target closer to you; four stunts to move them one range increment, twelve stunts to move them two increments, twenty-eight stunts to move them three increments, or sixty stunts to move them four increments.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Get Over There",
    id: "GET_OVER_THERE",
    description: "With a good arm and a little strain, you can throw allies about as well as weapons. If you have an ally and a weapon with projectiles at least the size of an arrow, you can attach the ally to a projectile and fire it wherever you want. This does not require a roll, but has a maximum range of one increment lower than your weapon's normal range.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Sight Without Eyes",
    id: "SIGHT_WITHOUT_EYES",
    description: "You can accept an amount of Confusion equal to your Wits Edge to ignore the Blinded Condition for a single ranged attack.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Disabling Shot",
    id: "DISABLING_SHOT",
    description: "You can make an attack with a ranged projectile weapon that sticks in an opponent's joints, muscles, or other important area. Until they use their entire turn to remove the projectile, they are Impaired on all rolls with a single attribute, decided when you make the attack (e.g. they could be Impaired on all Agility-based rolls). The magnitude of the Impaired effect is equal to twice your Agility Edge.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Delayed Shot",
    id: "DELAYED_SHOT",
    description: "You can set up a reel and a ranged weapon as a trap. When setting this up, roll an attack with the weapon, roll Think, and name a circumstance that will set off the attack. If someone else wants to find a trap afterwards, they have to roll Think against your initial Think roll. You automatically find any trap that you previously set. You cannot use Critical Shot, Aim, Bending Spear Technique, Lightning Strike, or any other ability that would cause you to accept Harm or use beads as part of the attack. The trap is immune to all conditions. The maximum number of traps you can have set up at once is equal to your Wits Edge.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Bending Spear Technique",
    id: "BENDING_SPEAR_TECHNIQUE",
    description: "By taking three Confusion, you can hit an enemy with a ranged attack even if you don't have a clear shot at that enemy. This can also get around the effects of Defender.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Focused Shot",
    id: "FOCUSED_SHOT",
    description: "When making a Throw attack, you can increase your Might Edge by half of your Wits Edge for the purposes of dealing damage.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Sniper",
    id: "SNIPER",
    description: "You can choose to treat the range increment of any ranged weapon you use as though it was one step higher—Close to Short, etc.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}, {
    name: "Overwhelming Accuracy",
    id: "OVERWHELMING_ACCURACY",
    description: "In order to buy this ability, either your Might or Agility must be at least 50. When you make a Throw roll, reroll all 1s. You may reroll them as many times as necessary to stop rolling 1s.",
    source: "position",
    type: "spearbearer",
    shinsu: false
}]
var wavecontroller_abilities = [{
    name: "Beads",
    id: "BEADS",
    description: "(you start with the Beads universal ability)\n You can create any number of beads, though you can only control a number equal to twice your Heart Edge.This does not require an action, but can only be done on your turn.Abilities marked with [Extended] involve an extended effect, and the beads used still count against your maximum controlled.You can accept an amount of Stress to: \n Ignore the limit on beads controlled for one Stress per round per bead.\n Create beads on somebody else's turn, at the cost of two Stress per bead. If you accept three additional Stress per bead, you can then use a single ability that uses beads and would normally require your action.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Precision",
    id: "PRECISION",
    description: "Add your Heart Edge to your Attune rolls.",
    source: "position",
    type: "wavecontroller",
    shinsu: false
}, {
    name: "Shinsu Wall [Extended]",
    id: "SHINSU_WALL_[EXTENDED]",
    description: "Use one or more beads to create a wall of energy, enough to block a hallway, that lasts one round. This requires using an action. It's impenetrable and has Structure and Toughness equal to your Heart Edge. You can create it anywhere within Short range. For each bead, you can choose one of the following options: \nThe wall deals a number of Injuries equal to your Heart Edge (minus their Resistance Edge) to anyone adjacent to it at the start of their turn. If you use an additional bead, the range of this effect increases to Close. \nIt slows anyone adjacent to it. If you use an additional bead, the range of this effect increases to Close. \nIncrease the Structure and Toughness by your Heart Edge. This requires one bead for the first use, two beads for the second, three beads for the third, and so on. \nIt lasts up to five rounds, or until you dismiss it (does not take an action, can only be done on your turn). Each additional bead gets another five rounds. \nThe wall's negative effects don't affect those you specify (up to a number of people equal to half your Heart). This includes the ability to pass through it without first breaking it.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Quick Shield [Extended]",
    id: "QUICK_SHIELD_[EXTENDED]",
    description: "Use one or more beads to create a shield of shinsu. This can either take the form of a battle-ready shield, which can be used to block attacks (using your Attune instead of your Brawl), or a larger barrier to protect you and others from damaging large-scale attacks. In the first case, the shield does not require use of a hand and lasts until destroyed or dispelled, and has Structure and Toughness equal to half your Heart Edge times the number of beads used. In the second case, this ability requires using at least as many beads as the number of people you're protecting, lasts until the end of your next turn (unless destroyed or dispelled), cannot affect anyone outside Short range, and has Structure and Toughness equal to your Heart Edge times the number of beads used. This does not require an action. If you use this on somebody else's turn, you accept three Stress and Fatigue.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Quick Weapon [Extended]",
    id: "QUICK_WEAPON_[EXTENDED]",
    description: "Use one or more beads to create a weapon from shinsu. This can take the form of any weapon, but does not have any special abilities. The weapon grants an amount of bonus dice equal to half the number of beads (rounded down), 10 Structure per bead, and 5 Toughness per bead. If your weapon can be used for both melee and ranged attacks, it only grants half the bonus dice to each type of roll (rounded up). This does not require an action. If you use this on somebody else's turn, you accept three Stress and Fatigue.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Flare Wave Explosion",
    id: "FLARE_WAVE_EXPLOSION",
    description: "Touch an enemy (requiring a Brawl or Move roll) and roll Attune (using a bead) against their Resistance to deal Unresisted Injuries equal to your Heart Edge per success. You can simultaneously use an additional bead (and roll Attune again, though you are Hindered this time) to avoid taking the same damage. You can use this entire ability with one action. You only need one success (not counting automatic successes) on the second Attune roll.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Reverse Flow Control [Extended]",
    id: "REVERSE_FLOW_CONTROL_[EXTENDED]",
    description: "Use one bead (requiring an Attune roll against the target's Resistance) to paralyze an enemy within Close range for one round. You can target Observers or Lighthouses using this; instead of rolling against your target's Resistance, you roll against their effective Agility (determined by their controller's Agility or Wits, respectively). If you successfully hit an Observer or Lighthouse, it's inoperable for one round and cannot move or have any abilities used through it. This uses your action. You can use stunts to extend the duration, at two stunts per round. You can use additional beads to extend the duration as well, at two beads per round. You cannot add beads afterwards.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Shot",
    id: "SHOT",
    description: "You can shoot any number of beads at one or more enemies (dividing the beads as you wish between them). This requires an Attune roll (roll once per enemy), and can be dodged or blocked. If you can't see your target, you fail the roll. Treat this as a Throw roll with Damage Base equal to your Heart Edge minus each enemy's Resistance Edge. You cannot use more successes on a target than the number of beads you used on that target. This is a ranged weapon with a range of Short. Shooting a bead consumes it. This requires your action. Increasing the range counts as increasing the casting range of this ability.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Magnify",
    id: "MAGNIFY",
    description: "Any ability you have that uses beads can be altered to reach farther, cover a wider area, or—in some cases—magnify the effect. \nCasting range: Abilities that do not, by default, include the caster in their area of effect or extend from the caster have a casting range. Using one additional bead, you can extend the casting range from your reach to Close. From Close to Short requires three beads, Short to Medium requires five beads, and Medium to Long requires 10 beads. You can increase by more than one step; to do so, add the additional bead costs together. Thus extending the casting range of an ability from Short to Long requires 15 beads. Abilities that require contact cannot have their casting range increased, unless they have some other way to increase the range to one of the normal increments. \nArea: If an ability would normally affect an area within reach, you can increase it to affect Close range by using three additional beads. You can increase the area from Close to Short range with seven additional beads, from Short to Medium range with 15 additional beads, and from Medium to Long range with 30 additional beads. Increases by more than one increment function the same as they do for casting range. Abilities that do not normally have an area of effect cannot gain one with this ability. \nDuration: For abilities that do not specify other ways to increase the duration, you can use any number of beads to increase the duration by the same number of rounds. You can do this at any point during the duration to increase it further, provided you're within the unaltered casting range. \nEffect: Some abilities may specify that they can have additional or different effects if you have this ability.",
    source: "position",
    type: "wavecontroller",
    shinsu: false
}, {
    name: "Dispel",
    id: "DISPEL",
    description: "You can use a bead and make an Attune roll against an enemy's Attune to counter one shinsu-based effect they created. This uses your action. You have to either be within Short range of the effect or the creator. If you accept two Stress, you can use this on someone else's turn. Abilities that use beads automatically use shinsu.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "All-Encompassing Sight",
    id: "ALL-ENCOMPASSING_SIGHT",
    description: "Using an action, you can detect anyone within Short range who is capable of using shinsu, as well as their approximate direction. You can always tell when shinsu is being manipulated. You can even approximately tell where. You still need to roll to know what exactly is happening.",
    source: "position",
    type: "wavecontroller",
    shinsu: false
}, {
    name: "Concussive Blast",
    id: "CONCUSSIVE_BLAST",
    description: "Using an action, you can use any number of beads to throw enemies away from you. This requires an Attune roll against their Resistance; if targeting more than one enemy, roll once and apply to each enemy's Resistance. You need at least one bead per enemy. This throws enemies back one range increment (within reach to Close, Close to Short, etc). If you have the Magnify ability, you can use more beads to throw them further—double the bead cost per enemy (including required beads for affecting further-away enemies) to throw them back two range increments, triple it to throw them back three range increments, and quadruple it if you need to throw someone from melee range to Long range.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Territory",
    id: "TERRITORY",
    description: "By taking time to circulate your shinsu around the area, you can designate that area as your territory. While taking time in this way, you cannot use shinsu for any other purpose, nor can you engage in any activities that require concentration. The area remains your territory until you leave it and remain outside for at least as long as you took originally (i.e. if you took ten minutes to declare it your territory, it takes ten minutes to stop being your territory once you leave). Within that area, you gain bonus dice that apply to all Attune rolls, as well as Move, Finesse, Throw, and Brawl rolls while under the effects of Shinsu Reinforcement. The number of bonus dice, as well as the size of the area, are determined by the amount of time you take.\nOne minute: Within your reach. +1 die\nTen minutes: Close range. +5 dice\nOne hour: Short range. +10 dice\nOne day: Medium range. +25 dice\nOne month: Long range. +50 dice\nOne year: The entire floor. +100 dice",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Essence Drain",
    id: "ESSENCE_DRAIN",
    description: "Touch an enemy (requiring a Brawl or Move roll) and roll Attune (using a bead) against their Resistance to transfer up to two Stress per success from you to them. You cannot use more successes than you used beads. You cannot give them more Stress than you currently have. This requires an action.",
    source: "position",
    type: "wavecontroller",
    shinsu: true
}, {
    name: "Overwhelming Control",
    id: "OVERWHELMING_CONTROL",
    description: "In order to buy this ability, either your Heart or Agility must be at least 50. When you make an Attune roll, reroll all 1s. You may reroll them as many times as necessary to stop rolling 1s.",
    source: "position",
    type: "wavecontroller",
    shinsu: false
}]
var human_abilities = [{
    name: "Trained",
    id: "TRAINED",
    description: "You increase all of your attributes by one.",
    source: "race",
    type: "human",
    shinsu: false
}, {
    name: "Climber",
    id: "CLIMBER",
    description: "Whenever you go up a floor, you gain experience equal to half the floor (round down).",
    source: "race",
    type: "human",
    shinsu: false
}, {
    name: "Why We Keep Going",
    id: "WHY_WE_KEEP_GOING",
    description: "You have a dream of some sort. Whenever you make progress towards this dream (other than going up the tower), gain experience equal to the highest floor you've reached. You can change your dream up to once per floor. When you do, you don't gain any experience the next time you make progress towards your dream. Changing your dream causes you to gain one Exhaustion. If you achieve your dream, you retire permanently. Suggestions for your dream:\n Someone I do/don't know killed my family/friends/lover. I need to get revenge.\n My family looks down on me. I need to prove to them what I can do.\n My friend/lover/family member went up the tower. I need to find them.\n This Tower isn't right. I want to change things.\n Someone I love is determined to climb the Tower. I'm going with them. If you want to choose this Dream, or one like it, discuss it with the other players (Regulars only). With their permission, choose one that this Dream applies to.\n [Partway up the tower] These are my friends now. I'm protecting them.",
    source: "race",
    type: "human",
    shinsu: false
}, {
    name: "Savings",
    id: "SAVINGS",
    description: "Start with 5,000 credits.",
    source: "race",
    type: "human",
    shinsu: false
}, {
    name: "Adaptable",
    id: "ADAPTABLE",
    description: "You don't start with this ability, but can buy it with experience as though it was a universal ability. Humans can survive and thrive anywhere—blazing heat, freezing cold, toxins, predators, hazards, anywhere. You become immune to all poisons. You can survive in temperatures where most anyone else would freeze solid or burst into flame. You can go without food, water, or sleep for as long as you need to.",
    source: "race",
    type: "human",
    shinsu: false
}]
var crocodile_abilities = [{
    name: "Tough",
    id: "TOUGH",
    description: "You increase your Might and Resistance scores by 3. When you spend experience to increase either of these attributes, you increase that attribute by your Tier plus one.",
    source: "race",
    type: "crocodile",
    shinsu: false
}, {
    name: "Big",
    id: "BIG",
    description: "You're unnaturally large. Your melee reach is twice a normal person's reach. However, you are Hindered on all Finesse rolls.",
    source: "race",
    type: "crocodile",
    shinsu: false
}, {
    name: "Sharp",
    id: "SHARP",
    description: "You have claws. If you choose to use them, your Brawl attacks have their initial Damage Base increased by 1.These do not count as weapons.",
    source: "race",
    type: "crocodile",
    shinsu: false
}, {
    name: "Live to Hunt",
    id: "LIVE_TO_HUNT",
    description: "Each time you fight a single opponent (i.e. fighting multiple at one time does not qualify), you gain experience equal to half their highest attribute (rounded down). This only applies once per person per month.",
    source: "race",
    type: "crocodile",
    shinsu: false
}, {
    name: "Doesn't Hunt Money",
    id: "DOESNT_HUNT_MONEY",
    description: "Start with 2,000 credits.",
    source: "race",
    type: "crocodile",
    shinsu: false
}, {
    name: "Feral",
    id: "FERAL",
    description: "You don't start with this ability, but can buy it with experience as though it was a universal ability. Any Harm you deal while Fragile, Weakened, Anxious, or Volatile is increased by half (rounded down).",
    source: "race",
    type: "crocodile",
    shinsu: false
}]
var canine_abilities = [{
    name: "Born Fighter",
    id: "BORN_FIGHTER",
    description: "You increase your Might, Resistance, and Agility scores by 2. When you spend experience to increase any of these attributes, you increase that attribute by your Tier plus one.",
    source: "race",
    type: "canine",
    shinsu: false
}, {
    name: "Implanted Weakness",
    id: "IMPLANTED_WEAKNESS",
    description: "Any attempt to influence or control your mental state to any degree automatically succeeds.",
    source: "race",
    type: "canine",
    shinsu: false
}, {
    name: "Not Down Yet",
    id: "NOT_DOWN_YET",
    description: "Every time you become Fragile (maximum once per day) or gain an Exhaustion or Trauma, you gain experience equal to the highest floor you've reached. Additionally, taking strenuous actions while Fragile does not cause you to gain an Injury. You can continue to act normally while Dying; any strenuous actions while Dying still cause you to accept an Injury. You are immune to any instant-death effects of Called Shots.",
    source: "race",
    type: "canine",
    shinsu: false
}, {
    name: "Transformation",
    id: "TRANSFORMATION",
    description: "You gain access to the Canine family's set of abilities. You need to purchase all of these abilities, as normal.",
    source: "race",
    type: "canine",
    shinsu: false
}, {
    name: "Sink or Swim",
    id: "SINK_OR_SWIM",
    description: "Start with 2,000 credits.",
    source: "race",
    type: "canine",
    shinsu: false
}]

var canine_transformation_abilities = [{
    name: "Mobility 1",
    id: "MOBILITY_1",
    description: "You get twice as many dice to Move rolls as normal, but only when on foot. You can only choose this once.",
    source: "race",
    type: "canine",
    stage: 1
}, {
    name: "Mobility 2",
    id: "MOBILITY_2",
    description: "You get twice as many dice to Move rolls as normal, but only when on foot.<br> You also gain the ability to slowly fly, swim, or burrow. Pick one; you are Hindered on Brawl and Move when in that situation. If you choose swimming or burrowing, you can breathe underwater or underground, respectively. <br> You must first have Mobility 1 to pick this, and you can only choose this once.",
    source: "race",
    type: "canine",
    stage: 2
}, {
    name: "Mobility 3",
    id: "MOBILITY_3",
    description: "In addition to the benefits of Mobility 2, choose one additional option from that ability (flying, swimming, or burrowing). You are no longer Hindered when moving in those ways. You must first have Mobility 2 to pick this, and you can only choose this once.",
    source: "race",
    type: "canine",
    stage: 3
}, {
    name: "Mobility 4",
    id: "MOBILITY_4",
    description: "In addition to the benefits of Mobility 3, you gain the remaining option from Mobility 2. The benefit of Mobility 1 now applies when not on foot. You must have Mobility 3 to <br> You get twice as many dice to Move rolls as normal.<br> You gain the ability to slowly fly, swim, or burrow, and you can breathe underwater or underground. You are Hindered on Brawl when in that situation",
    source: "race",
    type: "canine",
    stage: 4
}, {
    name: "Mobility 5",
    id: "MOBILITY_5",
    description: "Anything that would slow you doesn't have that effect, and anything that would paralyze you instead slows you for the same duration.<br> You get twice as many dice to Move rolls as normal.<br> You gain the ability to slowly fly, swim, or burrow, and you can breathe underwater or underground. You are Hindered on Brawl when in that situation",
    source: "race",
    type: "canine",
    stage: 5
}, {
    name: "Mobility 6",
    id: "MOBILITY_6",
    description: "You can no longer be slowed or paralyzed<br> You get twice as many dice to Move rolls as normal.<br> You gain the ability to slowly fly, swim, or burrow, and you can breathe underwater or underground. You are Hindered on Brawl when in that situation",
    source: "race",
    type: "canine",
    stage: 6
}, {
    name: "Mobility 7",
    id: "MOBILITY_7",
    description: "Instead of rolling twice as many dice with Move, you roll three times as many. <br> Additionally, dodging multiple times in one round doesn't reduce your bonus.",
    source: "race",
    type: "canine",
    stage: 7
}, {
    name: "Weapon 1",
    id: "WEAPON_1",
    description: "When you first choose this, pick the form you want your weapon to take. <br>If your chosen weapon is ranged, you also need to pick a maximum range. <br>If your chosen weapon is melee, it takes the form of a one-handed weapon. <br>When you use this weapon to attack, you get a number of bonus dice equal to your highest Edge and your Damage Base is increased by 2.",
    source: "race",
    type: "canine",
    stage: 1
}, {
    name: "Weapon 2",
    id: "WEAPON_2",
    description: "If your chosen weapon is ranged, you also need to pick a maximum range. <br>If your chosen weapon is melee, it takes the form of a one-handed weapon. <br>When you use this weapon to attack, you get a number of bonus dice equal to your highest Edge and your Damage Base is increased by 2.<br>Your weapon also deals Fatigue, Confusion, and Stress equal to your highest Edge minus the enemy's Resistance Edge. ",
    source: "race",
    type: "canine",
    stage: 2
}, {
    name: "Weapon 3",
    id: "WEAPON_3",
    description: "If you chose a melee weapon, you can now have it function as a two-handed weapon, or as many one-handed weapons as you can wield. You must make this choice when transforming—if you wish to change, you have to revert to your base form and transform again. <br>If you chose a ranged weapon, you can adjust the maximum range of your weapon on the fly. This does not require an action, and can be done on another person's turn. <br>The Dual Training, Bruiser, Thrower, and Stabber abilities now add dice equal to your highest Edge, not necessarily your Might or Agility Edge. <br>When you use this weapon to attack, you get a number of bonus dice equal to your highest Edge and your Damage Base is increased by 2.<br>Your weapon also deals Fatigue, Confusion, and Stress equal to your highest Edge minus the enemy's Resistance Edge. ",
    source: "race",
    type: "canine",
    stage: 3
}, {
    name: "Weapon 4",
    id: "WEAPON_4",
    description: "If you chose a melee weapon, you can now have it function as a two-handed weapon, or as many one-handed weapons as you can wield. <br>You must make this choice when transforming—if you wish to change, you have to revert to your base form and transform again. <br>If you chose a ranged weapon, you can adjust the maximum range of your weapon on the fly. This does not require an action, and can be done on another person's turn. <br>The Dual Training, Bruiser, Thrower, and Stabber abilities now add dice equal to your highest Edge, not necessarily your Might or Agility Edge. <br>When you use this weapon to attack, you get a number of bonus dice equal to your highest Edge and your Damage Base is increased by 6.<br>Your weapon also deals Fatigue, Confusion, and Stress equal to three times your highest Edge, minus the enemy's Resistance Edge. <br>The extra Harm your weapon deals triples. ",
    source: "race",
    type: "canine",
    stage: 4
}, {
    name: "Weapon 5",
    id: "WEAPON_5",
    description: "Whenever you hit an enemy with your weapon, you become invigorated, and heal for an amount of Injuries or Fatigue equal to half your highest Edge. This does not apply if you don't have Injuries equal to or greater than half your Might or Fatigue equal to or greater than half your Agility. If you are Fragile or Weakened, the healing doubles- it heals for an amount equal to your highest Edge. This can only heal you from Dying once per turn.",
    source: "race",
    type: "canine",
    stage: 5
}, {
    name: "Weapon 6",
    id: "WEAPON_6",
    description: "If you chose a melee weapon, you can now have it function as a two-handed weapon, or as many one-handed weapons as you can wield. <br>You must make this choice when transforming—if you wish to change, you have to revert to your base form and transform again. <br>If you chose a ranged weapon, you can adjust the maximum range of your weapon on the fly. This does not require an action, and can be done on another person's turn. <br>The Dual Training, Bruiser, Thrower, and Stabber abilities now add dice equal to your highest Edge, not necessarily your Might or Agility Edge. <br>When you use this weapon to attack, you get a number of bonus dice equal to your two times highest Edge and your Damage Base is increased by 6.<br>Your weapon also deals Fatigue, Confusion, and Stress equal to three times your highest Edge, minus the enemy's Resistance Edge. <br>The extra Harm your weapon deals triples. <br>Whenever you hit an enemy with your weapon, you become invigorated, and heal for an amount of Injuries or Fatigue equal to half your highest Edge. This does not apply if you don't have Injuries equal to or greater than half your Might or Fatigue equal to or greater than half your Agility. If you are Fragile or Weakened, the healing doubles- it heals for an amount equal to your highest Edge. This can only heal you from Dying once per turn.",
    source: "race",
    type: "canine",
    stage: 6
}, {
    name: "Weapon 7",
    id: "WEAPON_7",
    description: "If you chose a melee weapon, you can now have it function as a two-handed weapon, or as many one-handed weapons as you can wield. <br>You must make this choice when transforming—if you wish to change, you have to revert to your base form and transform again. <br>If you chose a ranged weapon, you can adjust the maximum range of your weapon on the fly. This does not require an action, and can be done on another person's turn. <br>The Dual Training, Bruiser, Thrower, and Stabber abilities now add dice equal to your highest Edge, not necessarily your Might or Agility Edge. <br>When you use this weapon to attack, you get a number of bonus dice equal to your two times highest Edge and your Damage Base is increased by 6.<br>Your weapon also deals Fatigue, Confusion, and Stress equal to three times your highest Edge, minus the enemy's Resistance Edge. <br>The extra Harm your weapon deals triples.<br>Whenever you hit an enemy with your weapon, you become invigorated, and heal for an amount of Injuries or Fatigue equal to half your highest Edge. This does not apply if you don't have Injuries equal to or greater than half your Might or Fatigue equal to or greater than half your Agility. If you are Fragile or Weakened, the healing doubles- it heals for an amount equal to your highest Edge. This can only heal you from Dying once per turn.<br>All damage your weapon deals is doubled. This includes the base damage, damage dealt through stunts, extra damage from Weapon 4, and any other damage dealt through your weapon. ",
    source: "race",
    type: "canine",
    stage: 7
}]

var canineStageInfo = ["Stage 1: A part of your body transforms, granting you mobility or a weapon. Choose one of the following:",
    "Stage 2: Purchasing this ability requires twice as much experience as any other ability (6, times three for every four abilities you've already bought). The transformed part evolves, becoming more powerful or versatile. Choose one of the following:",
    "Stage 3: Purchasing this ability requires 3 times as much experience as normal (9, times three for every four abilities bought). With the power of your transformation, you far exceed most others. This is as far as most Canines will ever be able to transform. Choose one of the following:",
    "Stage 4: Purchasing this ability requires 4 times as much experience (12, times three per four abilities). Your strength continues to grow. Choose one:",
    "Stage 5: Purchasing this ability requires 5 times as much experience (15 base). Less than a hundred Canines have ever reached this level. Choose one:",
    "Stage 6: Purchasing this ability requires 6 times as much experience (18 base). You've joined an elite group of a dozen Canines or less. Choose one:",
    "Stage 7: Purchasing this ability requires 7 times as much experience (21 base). Why do you need this much power? You don't need this much power."]

var canineMobilityChoices = [
    "Mobility 1: You get twice as many dice to Move rolls as normal, but only when on foot. ",
    "Mobility 2: In addition to the benefits of Mobility 1, you also gain the ability to slowly fly, swim, or burrow. Pick one; you are Hindered on Brawl and Move when in that situation. If you choose swimming or burrowing, you can breathe underwater or underground, respectively. You must first have Mobility 1 to pick this.",
    "Mobility 3: In addition to the benefits of Mobility 2, choose one additional option from that ability (flying, swimming, or burrowing). You are no longer Hindered when moving in those ways. You must first have Mobility 2 to pick this.",
    "Mobility 4: In addition to the benefits of Mobility 3, you gain the remaining option from Mobility 2. The benefit of Mobility 1 now applies when not on foot. You must have Mobility 3 to pick this.",
    "Mobility 5: In addition to the benefits of Mobility 4, you're harder to slow. Anything that would slow you doesn't have that effect, and anything that would paralyze you instead slows you for the same duration. You must first have Mobility 4.",
    "Mobility 6: In addition to the benefits of Mobility 5, you can no longer be slowed or paralyzed. You must first have Mobility 5.",
    "Mobility 7: Instead of rolling twice as many dice with Move, you roll three times as many. Additionally, dodging multiple times in one round doesn't reduce your bonus."
]

var canineWeaponChoices = [
    "Weapon 1: When you first choose this, pick the form you want your weapon to take. <br>If your chosen weapon is ranged, you also need to pick a maximum range. <br>If your chosen weapon is melee, it takes the form of a one-handed weapon. <br>When you use this weapon to attack, you get a number of bonus dice equal to your highest Edge and your Damage Base is increased by 2. ",
    "Weapon 2: In addition to the benefits of Weapon 1, your weapon also deals Fatigue, Confusion, and Stress equal to your highest Edge minus the enemy's Resistance Edge. You must first have Weapon 1 to pick this.",
    "Weapon 3: If you chose a melee weapon, you can now have it function as a two-handed weapon, or as many one-handed weapons as you can wield. You must make this choice when transforming—if you wish to change, you have to revert to your base form and transform again. If you chose a ranged weapon, you can adjust the maximum range of your weapon on the fly. This does not require an action, and can be done on another person's turn. The Dual Training, Bruiser, Thrower, and Stabber abilities now add dice equal to your highest Edge, not necessarily your Might or Agility Edge. You must first have Weapon 2.",
    "Weapon 4: In addition to the benefits of Weapon 3, the extra Harm your weapon deals triples. It now deals Fatigue, Confusion, and Stress equal to three times your highest Edge, minus the enemy's Resistance Edge. Increase the Damage Base by 6 instead of by 2. You must first have Weapon 3 to choose this.",
    "Weapon 5: Whenever you hit an enemy with your weapon, you become invigorated, and heal for an amount of Injuries or Fatigue equal to half your highest Edge. This does not apply if you don't have Injuries equal to or greater than half your Might or Fatigue equal to or greater than half your Agility. If you are Fragile or Weakened, the healing doubles- it heals for an amount equal to your highest Edge. This can only heal you from Dying once per turn. You must first have Weapon 4.",
    "Weapon 6: In addition to the benefits of Weapon 5, the bonus dice granted by Weapon 1 are doubled. You must first have Weapon 5.",
    "Weapon 7: All damage your weapon deals is doubled. This includes the base damage, damage dealt through stunts, extra damage from Weapon 4, and any other damage dealt through your weapon. You must first have Weapon 6."]



var silverdwarf_abilities = [{
    name: "The Path Forward",
    id: "THE_PATH_FORWARD",
    description: "When facing a decision of some sort, you can accept an amount of Confusion equal to your Wits Edge to roll Think and ask one question for every two successes.\n Which way is safest?\n Which way is fastest?\n What challenges lie in this direction?\n Any similar question about the immediate future.",
    source: "race",
    type: "silverdwarf",
    shinsu: false
}, {
    name: "Pathfinder",
    id: "PATHFINDER",
    description: "Whenever you help someone find the correct path or help them with their journey, gain experience equal to their highest attribute minus the greatest type of Harm they currently have (minimum 1). This can only apply once per person per floor.",
    source: "race",
    type: "silverdwarf",
    shinsu: false
}, {
    name: "Support of Your People",
    id: "SUPPORT_OF_YOUR_PEOPLE",
    description: "Start with 10,000 credits.",
    source: "race",
    type: "silverdwarf",
    shinsu: false
}, {
    name: "Jury-Rig",
    id: "JURY-RIG",
    description: "You don't start with this ability, but can buy it with experience as though it was a universal ability. Sometimes you have to make do with junk. Given an hour or two, plus access to a decent amount of supplies, you can put together a tool or machine that can get the job done. One job, at least. Whatever you create doesn't grant bonus dice.",
    source: "race",
    type: "silverdwarf",
    shinsu: false
}]
var redwitch_abilities = [{
    name: "Where Fate Leads",
    id: "WHERE_FATE_LEADS",
    description: "You can accept an amount of Stress equal to half your Heart (rounded up) to roll Attune and ask one question for every two successes.\n What should I do to achieve my goal?\n How can I get to my destination?\n How dangerous is this path?\n Any similar question about the future.",
    source: "race",
    type: "redwitch",
    shinsu: false
}, {
    name: "Guide",
    id: "GUIDE",
    description: "Whenever you guide someone where they need to go, and whenever a Regular changes their Dream because of you (directly or indirectly), gain experience equal to the total number of Harms they have. Calculate this after the Regular takes the Exhaustion for changing their Dream. Whenever someone takes Exhaustion or Trauma, or enters Weakened, Fragile, Anxious, or Volatile status because of advice or help you gave, gain experience equal to the Harms they have.",
    source: "race",
    type: "redwitch",
    shinsu: false
}, {
    name: "Gifts",
    id: "GIFTS",
    description: "Start with 10,000 credits.",
    source: "race",
    type: "redwitch",
    shinsu: false
}, {
    name: "Cassandra's Truth",
    id: "CASSANDRA'S_TRUTH",
    description: "You don't start with this ability, but can buy it with experience as though it was a universal ability. The more profound your words are, the more people distrust them. You can choose to take only half the normal Stress (rounded up) to use Where Fate Leads. Whatever answers you get, you have to convince others (with a Manipulate or Reach Out roll against their Think) for them to believe the truth of what you say.",
    source: "race",
    type: "redwitch",
    shinsu: false
}]
var noble_abilities = [{
    name: "Nepotism",
    id: "NEPOTISM",
    description: "You start off with up to two D-rank items, or any one C-rank item.",
    source: "race",
    type: "noble",
    shinsu: false
}, {
    name: "Allowance",
    id: "ALLOWANCE",
    description: "Every week, you receive 300 credits times the highest floor you've reached (e.g after reaching floor 10 you receive 3,000 per week).",
    source: "race",
    type: "noble",
    shinsu: false
}, {
    name: "Frowned Upon",
    id: "FROWNED_UPON",
    description: "If you attack any member of your noble family and the family finds out, you're disowned and stop getting your allowance.",
    source: "race",
    type: "noble",
    shinsu: false
}, {
    name: "Bloodline",
    id: "BLOODLINE",
    description: "You can purchase a unique ability, depending on your family. When you make your character, choose a family to belong to. You gain their name and are allowed to purchase their ability.",
    source: "race",
    type: "noble",
    shinsu: false
}, {
    name: "You Have Your Parents' Fire",
    id: "YOU_HAVE_YOUR_PARENTS'_FIRE",
    description: "Each family has an associated shinsu quality. If you ever gain the Shinsu Quality universal ability, any quality except the one associated with your family costs twice as much experience.",
    source: "race",
    type: "noble",
    shinsu: true
}, {
    name: "Making the Family Proud",
    id: "MAKING_THE_FAMILY_PROUD",
    description: "The family you choose has an experience trigger. You gain that ability for free.",
    source: "race",
    type: "noble",
    shinsu: false
}, {
    name: "Wealth",
    id: "WEALTH",
    description: "Start with 20,000 credits.",
    source: "race",
    type: "noble",
    shinsu: false
}]
var heir_abilities = [{
    name: "Royal Blood",
    id: "ROYAL_BLOOD",
    description: "Increase all of your attributes by three. Whenever you spend experience to increase one of your attributes, you increase that attribute by your Tier plus one. Start at Tier 2. You reach Tier 3 at the same time as the other races—after spending 5,000 experience.",
    source: "race",
    type: "heir",
    shinsu: false
}, {
    name: "Competition",
    id: "COMPETITION",
    description: "Whenever you defeat another Heir or ensure they won't be a competitor, you gain experience equal to three times their highest attribute.",
    source: "race",
    type: "heir",
    shinsu: false
}, {
    name: "Rich",
    id: "RICH",
    description: "Start with 50,000 credits.",
    source: "race",
    type: "heir",
    shinsu: false
}, {
    name: "Watch Your Back",
    id: "WATCH_YOUR_BACK",
    description: "You don't start with this ability, but can buy it with experience as though it was a universal ability. All Harm you deal to another Royal Heir is doubled.",
    source: "race",
    type: "heir",
    shinsu: false
}]
var irregular_abilities = [{
    name: "Learn by Doing",
    id: "LEARN_BY_DOING",
    description: "When you are hit by a shinsu attack, you can choose to treat the damage from that as Unresisted and gain experience equal to the Harm you take.",
    source: "race",
    type: "irregular",
    shinsu: true
}, {
    name: "Shake the Foundations of the Tower",
    id: "SHAKE_THE_FOUNDATIONS_OF_THE_TOWER",
    description: "Whenever you shake the status quo, you gain experience:\n Equal to the current floor for a tiny or temporary change.\n Equal to twice the current floor for a significant and long-lasting change.\n Equal to three times the current floor for a total upheaval.",
    source: "race",
    type: "irregular",
    shinsu: false
}, {
    name: "Rapid Growth",
    id: "RAPID_GROWTH",
    description: "Increasing to Tier 2 happens at 250 experience instead of 500. Increasing to each further Tier multiplies the required total experience by 5 instead of by 10; 1,250 and 6,250 instead of 5,000 and 50,000.",
    source: "race",
    type: "irregular",
    shinsu: false
}, {
    name: "Surprisingly Durable",
    id: "SURPRISINGLY_DURABLE",
    description: "At the beginning of the game, set your Resistance to 10.",
    source: "race",
    type: "irregular",
    shinsu: false
}, {
    name: "Enter Alone",
    id: "ENTER_ALONE",
    description: "Start with no money.",
    source: "race",
    type: "irregular",
    shinsu: false
}, {
    name: "Starting Small",
    id: "STARTING_SMALL",
    description: "During character creation, you do not receive free points to increase your attributes.",
    source: "race",
    type: "irregular",
    shinsu: false
}, {
    name: "Natural Control",
    id: "NATURAL_CONTROL",
    description: "You don't start with this ability, but can buy it with experience as though it was a universal ability. You do not need to sign a contract to control shinsu.",
    source: "race",
    type: "irregular",
    shinsu: true
}]
var keene_abilities = [{
    name: "Cold-Hearted",
    id: "COLD-HEARTED",
    description: "Whenever you make a Wits-based roll, you automatically gain successes equal to your Wits Edge in addition to any you would gain from other sources. Whenever you make a Heart-based roll, you are Impaired by an amount equal to your Heart Edge.",
    source: "family",
    type: "keene",
    shinsu: false
}]
var trumbald_abilities = [{
    name: "Crafter",
    id: "CRAFTER",
    description: "You can create and refine items. Creating them requires materials costing half of the item's price. Improving them requires materials costing one-tenth of the item's price. Either use requires a full day. When you do this, make a Finesse or Think roll. The number of required successes is determined by the rank: making or improving an E-rank item requires five successes; a D-rank item requires ten successes; a C-rank item requires twenty successes; a B-rank item requires fifty successes; an A-rank item requires 100 successes; and a S-rank item requires two hundred successes. You can use stunts to: increase the Toughness by 1, increase the Structure by 2, increase the amount of bonus dice the item grants by 1, or decrease the time required to one-half of what it was (the first usage of this stunt reduces the time to eight hours, the second reduces the time to four hours, etc). If you do not have enough successes on this roll, you recover materials equal to half of what you invested.",
    source: "family",
    type: "trumbald",
    shinsu: false
}]
var haas_abilities = [{
    name: "Strongest Body",
    id: "STRONGEST_BODY",
    description: "When you use Shinsu Reinforcement, you increase your Might and Agility by an amount equal to one and a half times your Heart (rounded down) instead of an amount equal to your Heart. While taking Stress to increase the bonus, you add three times your Heart instead of twice.",
    source: "family",
    type: "haas",
    shinsu: true
}]
var lemarque_abilities = [{
    name: "Capture",
    id: "CAPTURE",
    description: "You can use your action and accept Stress equal to twice your Heart Edge to attempt to exert your will over a divine fish within Short range. Make an Attune roll against the fish's Resistance (this roll is Impaired by an amount equal to their Heart plus their Wits if used against an intelligent creature). If you succeed, you have complete control over that fish for as long as you want, until either you fall unconscious for any reason, someone else uses this ability on the fish (which uses a Attune roll against your Attune), or you choose to release the fish.",
    source: "family",
    type: "lemarque",
    shinsu: false
}]
var halleck_abilities = [{
    name: "Made of Granite",
    id: "MADE_OF_GRANITE",
    description: "When you first take this ability, double your Resistance. Anything that would increase your Resistance (including spending experience) increases it by twice as much.",
    source: "family",
    type: "halleck",
    shinsu: false
}]
var posada_abilities = [{
    name: "Analysis",
    id: "ANALYSIS",
    description: "Through sheer intelligence, you've managed to partially replicate the essential ability of a Guide. You can ask the GM any one question. If you have the minimum information necessary to reach an answer through logic and thought, the GM answers you and you accept Confusion equal to your Wits Edge. If you don't have enough information, you accept Confusion equal to half your Wits Edge (round up).",
    source: "family",
    type: "posada",
    shinsu: false
}]
var aven_abilities = [{
    name: "Family Swordsmanship",
    id: "FAMILY_SWORDSMANSHIP",
    description: "Through intense training and the revelation of some family secrets, your sword has stopped being a physical object, and is instead a shinsu-based manifestation of your skill and bloodlust. You can create a shinsu sword by taking one Stress. This does not require an action and does not need to happen on your turn. Bonuses that would normally only apply when wielding a physical sword apply when wielding your shinsu sword. Because your sword no longer has a physical form, it isn't as bound by the rules of reality, and tends to hit its target every time. Your attacks with the shinsu sword cannot be dodged by anyone with an Agility lower than your Heart, nor can they be blocked with anything that does not protect your target's entire body (e.g. a suit of armor would protect them, while an armor inventory would not). Your Damage Base with this is equal to your Might Edge plus half your Heart Edge. Your shinsu sword functions as both a blade and a needle for the purposes of Weapon Skills and other abilities.",
    source: "family",
    type: "aven",
    shinsu: true
}]
var yanetta_abilities = [{
    name: "Shrouded in Flame",
    id: "SHROUDED_IN_FLAME",
    description: "You can accept one Stress per round to become engulfed in your own fire. All enemies within your reach at the end of each of your turns, or who attack you in melee (this applies for each attack), take Injuries equal to your Heart Edge minus their Resistance Edge (minimum 1). While this is active you increase your Resistance by an amount equal to twice your Heart Edge. This doesn't require an action to activate, but must be activated on your turn.",
    source: "family",
    type: "yanetta",
    shinsu: false
}]
