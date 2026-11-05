'use strict';
const CASE = {
 title: 'The Vanishing of the Starfall',
 subtitle: 'The Astoria Museum · October 31 · 11:42 PM',
 description: 'A priceless painting disappeared during a black-tie gala. Three people had access to the east gallery. The museum closes at dawn. Find the thief before the trail goes cold.',
 suspects: [
  {id:'mara',name:'Mara Vale',role:'Museum Curator',initial:'MV',color:'#9e84cd',bio:'Organized the gala. Knows the gallery schedule and the painting’s valuation.'},
  {id:'theo',name:'Theo Reed',role:'Night Security',initial:'TR',color:'#79ac9b',bio:'Guarded the east wing. Claims a short power failure disrupted the cameras.'},
  {id:'iris',name:'Iris Chen',role:'Art Restorer',initial:'IC',color:'#d2a579',bio:'Recently restored the Starfall. Had authorized access to conservation supplies.'}
 ],
 locations: [
  {id:'gallery',name:'East Gallery',icon:'◈',description:'The empty frame, a velvet rope, and a suspiciously clean floor.'},
  {id:'security',name:'Security Office',icon:'⌁',description:'Camera logs, badge records, and an unusual interruption.'},
  {id:'studio',name:'Restoration Studio',icon:'✦',description:'Paints, solvents, and a storage cabinet locked in a hurry.'}
 ]
};
const CLUES = {
 frame:{id:'frame',title:'Unbroken Frame',location:'gallery',detail:'The frame has no pry marks. Someone who knew the mounting system removed the canvas carefully.',weight:'Access'},
 fibers:{id:'fibers',title:'Blue Silk Fiber',location:'gallery',detail:'A cobalt-blue silk thread is caught behind the gallery display bracket.',weight:'Physical evidence'},
 blackout:{id:'blackout',title:'Camera Blackout',location:'security',detail:'Cameras stopped recording for exactly six minutes at 9:14 PM. The backup power system did not fail.',weight:'Timeline'},
 badge:{id:'badge',title:'9:17 Badge Entry',location:'security',detail:'The access log records Iris Chen entering the east gallery at 9:17 PM, during the camera interruption.',weight:'Timeline'},
 varnish:{id:'varnish',title:'Fresh Varnish Residue',location:'studio',detail:'A solvent cloth is stained with the unique conservation varnish used on the Starfall.',weight:'Forensic'},
 crate:{id:'crate',title:'Mislabeled Shipping Crate',location:'studio',detail:'A crate labeled “plaster replicas” contains a canvas-sized hidden compartment and traces of cobalt pigment.',weight:'Physical evidence'}
};
const solution='iris';
function newGame() { return {visited:[], clues:[], conversations:[], attempts:0, solved:false, score:null}; }
function inspect(game, locationId) {
 if (!CASE.locations.some(l=>l.id===locationId)) return {error:'Unknown location.'};
 if (!game.visited.includes(locationId)) game.visited.push(locationId);
 const discovered=Object.values(CLUES).filter(c=>c.location===locationId && !game.clues.includes(c.id));
 discovered.forEach(c=>game.clues.push(c.id));
 return {location:locationId,discovered,description:CASE.locations.find(l=>l.id===locationId).description};
}
function accuse(game, suspectId) {
 if(game.solved) return {error:'The case is already closed.'};
 if(!CASE.suspects.some(s=>s.id===suspectId))return {error:'Unknown suspect.'};
 if(game.clues.length<3)return {error:'You need at least three clues before making an accusation.'};
 game.attempts++;
 const correct=suspectId===solution;
 if(correct){game.solved=true;game.score=Math.max(40,100-(6-game.clues.length)*6-(game.attempts-1)*15);}
 return {correct,solved:game.solved,score:game.score,message:correct?'Case closed. Iris used her authorized access to remove the canvas, staged the camera interruption and hid it in a mislabeled crate. The fibers, badge log and varnish tie her to the theft.':'The evidence does not support that accusation. Review the timeline, materials, and access records, then try again.'};
}
function scriptedReply(game, suspect, message) {
 const m=message.toLowerCase();
 const knows=(id)=>game.clues.includes(id);
 const responses={
  mara:{intro:'The Starfall was the centerpiece of the gala. I was greeting donors in the atrium. Ask me about the guest list, the painting, or access to the gallery.',alibi:'I was at the atrium reception from nine until nearly ten. At least a dozen donors saw me there.',access:'Only the curator, security, and conservation staff had access. Iris knows the special mounting mechanism better than anyone.',painting:'The Starfall is insured for millions, but no amount of money can replace it.',camera:'A camera interruption? That is deeply concerning. Theo oversees the system.',clue:'The frame was untouched? Then this was not an ordinary smash-and-grab.'},
  theo:{intro:'I was monitoring the feeds all night. I did not take that painting. Ask me about the blackout, badge logs, or my patrol.',alibi:'I was in the security office doing the 9 PM log, then I walked the west corridor.',access:knows('badge')?'The log says Iris badged into the east gallery at 9:17. That was inside the outage window.':'Badge entries are timestamped, so check the office logs if you want facts.',camera:knows('blackout')?'That six-minute feed gap was a manual maintenance override, not a power failure. I never authorized it.':'There was a brief feed interruption. Check the system logs in my office.',painting:'I watch cameras, not paintings. The mounting hardware is not my specialty.',clue:'The security logs are harder to fake than someone’s story. Start there.'},
  iris:{intro:'The whole museum is blaming the conservation department. I spent weeks restoring that piece. Ask me about my schedule, supplies, or the canvas.',alibi:knows('badge')?'Yes, I entered at 9:17, but only to check the humidity controls. I should have mentioned it earlier.':'I was in my studio cleaning brushes after the gala started.',access:'I have authorized access for conservation work. That does not make me a thief.',camera:'I do not operate the security system. Ask Theo.',painting:knows('varnish')?'That varnish was part of routine restoration. It proves I worked on the art, not that I stole it.':'The Starfall has a specialized varnish layer. You cannot treat it like an ordinary canvas.',clue:knows('crate')?'That crate is old storage inventory. I have no idea why it has a concealed compartment.':'The studio contains many old conservation materials; none of them are proof.'}
 };
 let topic='intro';
 if(/alibi|where|time|doing|tonight|9:/.test(m))topic='alibi';
 else if(/badge|entry|door|access|key/.test(m))topic='access';
 else if(/camera|blackout|power|security|footage/.test(m))topic='camera';
 else if(/paint|canvas|starfall|varnish|restor/.test(m))topic='painting';
 else if(/clue|evidence|fiber|crate|suspect|think/.test(m))topic='clue';
 let reply=responses[suspect.id][topic];
 if(suspect.id==='iris' && knows('fibers') && /fiber|silk|blue|scarf/.test(m))reply='My scarf is blue, yes. That alone is not proof. Lots of people wear blue to a gala.';
 if(suspect.id==='mara' && /iris|restorer/.test(m))reply='Iris had full conservation access. She is meticulous, sometimes secretive, but I trusted her with the Starfall.';
 if(suspect.id==='theo' && /iris|restorer/.test(m))reply=knows('badge')?'Iris entered the gallery during the outage. Ask her why she omitted that from her original statement.':'I saw Iris carrying supplies earlier, but I cannot place her during the outage.';
 return reply;
}
function hint(game){
 if(!game.visited.includes('gallery'))return 'Start with the East Gallery. The empty frame can tell you whether this was forced entry.';
 if(!game.visited.includes('security'))return 'Investigate the Security Office. Compare the camera timeline to the badge log.';
 if(!game.visited.includes('studio'))return 'Search the Restoration Studio. Look for material traces and concealed storage.';
 if(game.conversations.length<2)return 'Question Theo about the blackout and Iris about her whereabouts at 9:17 PM.';
 return 'Connect the 9:17 badge entry, the silk fiber, and the restoration supplies. Which suspect explains all three?';
}
module.exports={CASE,CLUES,newGame,inspect,accuse,scriptedReply,hint};
