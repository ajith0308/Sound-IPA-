// ---- Lesson type: [topic, tip, words[]] ----
export type Lesson = [string, string, string[]];

export const LESSONS: Lesson[] = [
["Short Vowel Sounds (a, e, i, o, u)","Each short vowel makes one quick sound: a=cat, e=bed, i=pig, o=dog, u=sun.",
["cat","hat","bag","map","tap","ran","sad","jam","pan","lad","bed","hen","net","pen","red","ten","wet","leg","jet","beg","pig","sit","big","fin","lip","win","dig","hit","rib","tin","dog","hot","top","log","mop","cot","rod","box","pop","fox","sun","cup","bug","mud","run","nut","cut","hug","bus","tub"]],
["Long Vowel Sounds","Long vowels 'say their name': a=cake, e=tree, i=bike, o=home, u=cube.",
["cake","name","game","gate","lake","made","tape","wave","cave","plane","tree","feet","green","sleep","need","seed","meet","keep","week","three","bike","kite","time","ride","line","five","nice","side","wide","shine","home","bone","rose","note","hope","rope","nose","stone","phone","globe","cube","mule","cute","tune","tube","huge","June","rule","use","flute"]],
["CVC Words","Consonant-Vowel-Consonant words. Blend the three sounds together.",
["cat","dog","pen","mud","bat","fin","hop","jam","kit","log","nut","web","bed","sun","pig","fox","cup","hat","red","van","bus","dig","gum","ham","jet","lip","mob","net","pot","rat","sit","tap","wig","zip","bag","cab","den","fig","gap","hut","job","kid","lap","man","nap","pit","rug","sob","tin","yes"]],
["Magic E (Silent E)","A silent 'e' at the end makes the vowel say its name: hop -> hope.",
["cane","kite","note","cube","tape","hope","ride","cute","plane","stone","these","slime","cake","name","game","gate","made","wave","cave","lake","bike","time","line","five","nice","side","wide","shine","mine","wine","bone","rose","hole","pole","mole","code","rode","woke","joke","smoke","mule","tune","tube","use","huge","rule","June","prune","flute","globe"]],
["Consonant Digraphs (sh, ch, th, wh, ph, ck, ng)","Two letters, one sound.",
["ship","shop","shell","fish","wish","cash","brush","shut","shed","shark","chin","chat","chip","chop","rich","much","lunch","bench","chair","check","thin","this","that","then","bath","path","moth","with","cloth","thick","when","what","whip","wheel","white","whale","which","while","phone","graph","duck","sock","rock","kick","pick","king","ring","sing","long","song"]],
["Consonant Blends (bl, br, cl, cr, dr, fl, gl, gr)","Two consonants blended, both sounds heard.",
["black","block","blue","blend","brown","bring","brave","bread","clap","click","clean","cloud","crab","cross","cry","crown","drum","dress","drop","drive","flag","flat","floor","fly","glad","glass","globe","grab","grin","green","plum","plan","play","plant","spin","spot","spell","stop","star","step","swim","sweet","swing","twin","trip","tree","frog","from","snake","smile"]],
["Weekly Review + Reading","Read each word, then the sentences.",
["cat","bed","pig","dog","sun","cake","tree","bike","home","cube","ship","chin","thin","when","phone","black","drum","flag","green","swim","hat","net","hot","cup","name","kite","note","fish","chat","that","brush","chair","cloth","whale","king","ring","plane","stone","smile","frog","The frog can hop on the log.","A ship came home in the rain.","She had lunch in the shade.","The king has a green ring.","We swim in the lake at noon."]],
["Vowel Teams (ai, ay, ee, ea, oa, ow, ie, igh, ue)","Two vowels team up to make one sound.",
["rain","tail","wait","paint","train","sail","maid","chain","afraid","plain","day","play","stay","gray","tray","spray","clay","may","way","feet","tree","green","sleep","need","three","sweet","wheel","keep","deep","sea","meat","read","leaf","team","beach","clean","dream","seat","boat","coat","road","soap","toad","goat","snow","grow","blow","light","blue"]],
["R-Controlled Vowels (ar, er, ir, or, ur)","The 'r' changes the vowel: car, her, bird, corn, turn.",
["car","star","arm","farm","hard","park","dark","card","yard","sharp","her","herd","fern","term","verb","clerk","perch","germ","stern","nerve","bird","girl","dirt","shirt","third","first","birth","twirl","stir","firm","corn","fork","born","storm","short","sport","horse","north","thorn","sort","turn","burn","hurt","curl","surf","nurse","purse","church","burst","curb"]],
["Diphthongs (oi, oy, ou, ow, au, aw)","Gliding vowel sounds: coin, boy, out, cow, sauce, saw.",
["coin","oil","boil","join","point","soil","voice","noise","spoil","coil","boy","toy","joy","enjoy","royal","loyal","annoy","destroy","employ","out","loud","cloud","mouth","house","found","round","ground","sound","count","cow","now","how","down","town","brown","crown","owl","growl","flower","sauce","cause","haul","launch","autumn","saw","paw","draw","claw","yawn","hawk"]],
["Soft C & Soft G","c and g are 'soft' before e, i, y: city, cent, giant, gem.",
["city","cent","ice","cell","face","race","rice","nice","mice","place","space","price","dance","prince","circle","pencil","decide","center","celery","cinema","since","twice","fancy","spicy","notice","giant","gem","page","cage","age","huge","stage","magic","gentle","giraffe","ginger","energy","danger","engine","orange","change","large","bridge","village","gym","gigantic","region","digit","germ"]],
["Hard C & Hard G","c and g are 'hard' before a, o, u: cat, cup, goat, gum.",
["cat","cot","cup","cake","can","cap","car","cave","coat","cold","cost","cut","club","clap","crab","cream","clock","cross","camp","corn","cook","cool","cactus","comic","control","goat","gum","gate","gold","glad","game","grab","green","grass","grape","gift","girl","goose","good","gas","garden","guitar","ghost","glove","glass","grow","great","ground","guard","gap"]],
["Silent Letters (kn, wr, mb, gn, ps, lk)","Some letters are written but not heard: knee, write, lamb.",
["knee","knife","knock","know","knot","knit","knight","knob","kneel","knew","write","wrong","wrap","wrist","wreck","wren","wrench","wrote","wriggle","wrinkle","lamb","comb","thumb","climb","crumb","bomb","limb","numb","tomb","plumber","sign","gnome","gnat","design","gnaw","resign","reign","foreign","campaign","gnarl","psalm","walk","talk","chalk","folk","yolk","half","calf","could","should"]],
["Weekly Review + Dictation","Listen and write each word, then the sentences.",
["rain","day","feet","boat","snow","car","bird","corn","turn","coin","boy","out","cow","saw","city","giant","cage","cat","gold","garden","knee","write","lamb","sign","walk","magic","gentle","orange","bridge","cloud","paint","train","storm","church","flower","launch","pencil","guitar","thumb","knight","The girl saw a bird in the corn.","He wrote his name on the sign.","We found a coin in the brown box.","The giant read a book by the light.","Please walk to the shop and buy milk."]],
["Syllables (Open & Closed)","Open ends in a long vowel (he, go); closed ends in a consonant (cat, napkin).",
["he","go","me","we","no","so","hi","she","be","why","paper","tiger","robot","pilot","music","open","over","even","item","unit","napkin","rabbit","sunset","muffin","lemon","wagon","dragon","basket","picnic","pocket","cabin","magnet","velvet","insect","helmet","tennis","kitten","mitten","button","rocket","begin","silent","moment","spider","table","apron","human","final","zero"]],
["Syllables (VCe & R-Controlled)","Longer words split into beats: com-pete, gar-den, thun-der.",
["compete","mistake","invite","explode","reptile","admire","decide","escape","ignore","provide","costume","confuse","include","athlete","sunshine","cupcake","milkshake","inside","alone","awoke","garden","corner","market","thunder","perform","morning","forget","herself","turnip","hornet","sister","winter","summer","dinner","letter","better","hammer","dollar","mirror","sugar","partner","harder","birthday","thirteen","doctor","actor","tractor","mixture","picture","perhaps"]],
["Prefixes (un-, re-, dis-, pre-, mis-)","A prefix adds to the start and changes meaning: un+happy = unhappy.",
["unhappy","unlock","unfair","unkind","unable","undo","unpack","unsafe","unwell","unload","redo","return","rewrite","reuse","replay","refill","rebuild","react","recall","remove","disagree","dislike","disappear","dishonest","disobey","discount","disorder","distrust","discomfort","disconnect","preview","prepay","preheat","prevent","predict","prepare","preschool","prefix","pretest","presoak","misplace","mislead","misspell","mistake","misprint","misuse","misbehave","miscount","mismatch","misread"]],
["Suffixes (-ing, -ed, -er, -est, -ful, -less, -ly)","A suffix adds to the end: help+ful = helpful.",
["playing","singing","jumping","reading","running","sitting","hopping","making","writing","coming","jumped","painted","wanted","played","helped","walked","called","needed","landed","filled","faster","taller","smaller","kinder","harder","longer","slower","warmer","colder","richer","tallest","fastest","kindest","hardest","longest","biggest","smallest","nicest","saddest","coldest","helpful","careful","useful","hopeful","painful","careless","hopeless","useless","quickly","slowly"]],
["Root Words","Find the base word inside: helpful -> help; player -> play.",
["help","helper","helpful","helpless","unhelpful","play","player","playful","playing","replay","care","careful","careless","caring","uncaring","farm","farmer","farming","teach","teacher","teaching","friend","friendly","friendship","use","useful","useless","reuse","user","like","dislike","kind","kindness","unkind","kindly","hope","hopeful","hopeless","hoping","joy","joyful","paint","painter","painting","act","actor","action","react","sad","sadness"]],
["Compound Words","Two words joined into one: sun+flower = sunflower.",
["sunflower","sunshine","sunset","football","baseball","basketball","rainbow","raincoat","rainfall","cupcake","bedroom","bathroom","classroom","notebook","textbook","bookshelf","toothbrush","toothpaste","butterfly","dragonfly","popcorn","playground","snowman","snowball","weekend","birthday","cannot","everyone","everything","anything","something","someone","nobody","myself","yourself","inside","outside","upstairs","downstairs","sidewalk","grandmother","grandfather","homework","haircut","seashell","starfish","firefly","cowboy","keyboard","doorbell"]],
["Weekly Review + Reading","Read the words, then the sentences.",
["paper","rabbit","compete","garden","sister","picture","unhappy","return","disagree","preview","playing","jumped","faster","helpful","careful","helper","player","friendly","useful","kindness","sunflower","football","rainbow","bedroom","notebook","playground","homework","weekend","birthday","someone","tiger","napkin","invite","thunder","mistake","unlock","rewrite","singing","tallest","careless","The teacher is playing football with the class.","My grandmother baked a birthday cake.","Please finish your homework before the weekend.","The painter used a careful, gentle stroke.","Everyone helped to unpack the boxes."]],
["Homophones","Sound the same, spelled differently: hear/here, to/too/two.",
["hear","here","to","too","two","their","there","they're","your","you're","sea","see","one","won","right","write","know","no","flower","flour","sun","son","blue","blew","buy","by","bye","hour","our","meet","meat","plain","plane","pair","pear","bear","bare","road","rode","sale","sail","tail","tale","week","weak","wait","weight","mail","male","break"]],
["Homographs","Spelled the same, different meaning or sound: bow, lead, tear, wind.",
["bow","lead","tear","wind","live","read","close","bass","object","present","record","desert","minute","wound","refuse","produce","content","contest","contract","permit","project","rebel","subject","address","conduct","conflict","convert","digest","insult","perfect","dove","sow","bat","bark","fair","kind","left","ring","rock","spring","watch","wave","band","bright","park","play","saw","second","well","fine"]],
["Commonly Confused Words","Words often mixed up: then/than, lose/loose, its/it's.",
["accept","except","affect","effect","then","than","lose","loose","quiet","quite","desert","dessert","advice","advise","principal","principle","weather","whether","its","it's","your","you're","there","their","they're","to","too","two","whose","who's","break","brake","hear","here","peace","piece","right","write","allowed","aloud","past","passed","choose","chose","later","latter","farther","further","stationary","stationery"]],
["High-Frequency Words (Dolch/Fry)","Very common words to know by sight.",
["the","and","was","said","they","have","from","with","this","that","what","were","when","your","there","would","could","should","because","people","about","other","which","their","these","first","water","called","where","through","before","little","another","around","sentence","thought","different","together","important","enough","every","great","three","always","world","house","again","family","friend","school"]],
["Word Families (-at, -an, -op, -ig)","Same ending, change the first sound: cat, hat, bat.",
["cat","hat","bat","mat","rat","sat","fat","pat","that","flat","can","man","ran","pan","fan","tan","van","plan","than","span","hop","top","mop","pop","cop","stop","shop","drop","chop","prop","big","dig","pig","wig","fig","jig","twig","bug","rug","hug","mug","tug","jug","plug","drug","snug","slug","shrug","bag","tag"]],
["Stress & Pronunciation","Longer words have a strong beat: ba-NA-na, com-PU-ter.",
["banana","computer","tomato","umbrella","elephant","potato","hospital","remember","together","important","family","holiday","camera","animal","chocolate","telephone","calendar","dinosaur","hamburger","wonderful","beautiful","September","adventure","imagine","celebrate","dangerous","favourite","president","restaurant","vegetable","comfortable","interesting","temperature","February","necessary","library","medicine","different","electric","energy","volcano","tornado","piano","radio","video","memory","history","positive","musician","director"]],
["Sentence Reading Fluency","Read each sentence smoothly and clearly.",
["The quick brown fox jumps over the lazy dog.","She sells sea shells by the sea shore.","I would like to read a good book today.","We can walk to the park after lunch.","Please remember to bring your notebook.","The weather is bright and warm this morning.","My friend and I are learning to spell.","He carefully painted the garden fence.","They found a coin under the old bridge.","A little practice each day makes progress.","The teacher wrote the answer on the board.","Can you help me carry these heavy boxes?","We watched the birds fly over the field.","Reading out loud helps you learn new words.","The children played happily in the sunshine.","I need to finish my homework before dinner.","She whispered the secret to her best friend.","The train arrived exactly on time today.","Everyone enjoyed the delicious birthday cake.","Take a deep breath and try the word again."]],
["Listening & Dictation Practice","Listen, then write each sentence.",
["Good morning, how are you today?","I am learning to read and spell.","Practice makes progress every day.","Can you say that word again, slowly?","Thank you very much for your help.","Please speak a little more clearly.","I would like a glass of water, please.","What time does the lesson start?","Let us try that sentence one more time.","You are doing really well, keep going.","Where did you put my blue notebook?","I enjoy reading stories in the evening.","Could you repeat the last word for me?","We should meet again next Wednesday.","Remember to sound out each part.","The answer is on the next page.","I understand a little more every day.","Please listen carefully and then repeat.","That was a difficult word to spell.","Well done, you spelled it correctly."]],
["Monthly Review & Assessment","A mix from the whole month.",
["ship","cake","giant","turn","knife","unhappy","sunflower","because","computer","rainbow","weather","together","chin","boat","coin","garden","magic","orange","bridge","thunder","playing","careful","helper","football","homework","banana","umbrella","hospital","remember","important","knee","write","sign","walk","city","gentle","cloud","flower","paint","storm","prince","village","guitar","thirteen","mistake","kindness","friendly","beautiful","different","necessary"]]
];

// ---- Grammar: [question, options[], answerIndex, why, topic] ----
export type GQ = [string, string[], number, string, string];
export const GRAMMAR: GQ[] = [
["I saw ___ elephant at the zoo.",["a","an","the"],1,"Use 'an' before a vowel sound: an elephant.","Articles"],
["She wants ___ apple, please.",["a","an","some"],1,"'an apple' - 'a' starts with a vowel sound.","Articles"],
["He is ___ honest man.",["a","an","the"],1,"'honest' starts with a vowel sound (silent h), so use 'an'.","Articles"],
["I have ___ dog and ___ cat.",["a, an","a, a","an, a"],1,"Both start with consonant sounds: a dog, a cat.","Articles"],
["She ___ my best friend.",["is","are","am"],0,"Singular subject 'she' takes 'is'.","Agreement"],
["They ___ playing outside.",["is","are","am"],1,"Plural subject 'they' takes 'are'.","Agreement"],
["The dogs ___ barking loudly.",["is","are","was"],1,"'dogs' is plural, so use 'are'.","Agreement"],
["My brother and I ___ going to school.",["is","are","am"],1,"'My brother and I' is plural, so 'are'.","Agreement"],
["He ___ a new bike yesterday.",["buy","buys","bought"],2,"Yesterday means past tense: 'bought'.","Tenses"],
["Yesterday we ___ to the park.",["go","went","gone"],1,"Past tense of 'go' is 'went'.","Tenses"],
["She has ___ her lunch already.",["eat","ate","eaten"],2,"After 'has', use the past participle 'eaten'.","Tenses"],
["Right now the baby ___ sleeping.",["is","was","are"],0,"'Right now' + singular = 'is sleeping'.","Tenses"],
["He ___ not like spicy food.",["do","does","did"],1,"Third person singular present: 'does not'.","Tenses"],
["There are three ___ on the table.",["box","boxs","boxes"],2,"Plural of 'box' is 'boxes'.","Plurals"],
["I have two ___.",["childs","children","childrens"],1,"'children' is the plural of 'child'.","Plurals"],
["The farmer has many ___.",["sheeps","sheep","sheepes"],1,"'sheep' is the same in singular and plural.","Plurals"],
["This is ___ book, not yours.",["my","mine","me"],0,"'my' comes before a noun; 'mine' stands alone.","Pronouns"],
["That pencil is ___.",["my","mine","I"],1,"'mine' stands alone: it is mine.","Pronouns"],
["Give the ball to ___.",["I","me","my"],1,"After 'to', use the object pronoun 'me'.","Pronouns"],
["The cat is ___ the box.",["in","on","at"],0,"'in' means inside the box.","Prepositions"],
["The cup is ___ the table.",["in","on","under"],1,"'on' means on top of the table.","Prepositions"],
["We will meet ___ Monday.",["in","on","at"],1,"Use 'on' with days: on Monday.","Prepositions"],
["The film starts ___ 7 o'clock.",["in","on","at"],2,"Use 'at' with clock times: at 7.","Prepositions"],
["___ going to the beach today.",["Their","There","They're"],2,"'They're' = they are.","Confusions"],
["Please put it over ___.",["their","there","they're"],1,"'there' = a place.","Confusions"],
["The children lost ___ books.",["their","there","they're"],0,"'their' = belonging to them.","Confusions"],
["___ car is very fast.",["Your","You're","Yours"],0,"'Your' shows possession before a noun.","Confusions"],
["I think ___ very kind.",["your","you're","yours"],1,"'you're' = you are.","Confusions"],
["The dog wagged ___ tail.",["its","it's","its'"],0,"'its' = belonging to it (no apostrophe).","Confusions"],
["___ raining outside.",["Its","It's","Its'"],1,"'It's' = it is.","Confusions"],
["We saw the dog. ___ was very friendly.",["it","It","its"],1,"A sentence starts with a capital letter: 'It'.","Punctuation"],
["Choose the correctly written sentence.",["i like reading books.","I like reading books.","I like reading books"],1,"Start with a capital I and end with a full stop.","Punctuation"],
["Where should the question mark go? 'Are you coming'",["Are you coming.","Are you coming?","Are you coming!"],1,"A question ends with a question mark.","Punctuation"],
["Pick the correct one:",["Its cold, lets go home.","It's cold, let's go home.","Its cold, let's go home."],1,"'It's' = it is; 'let's' = let us.","Punctuation"],
["He ___ football every Saturday.",["play","plays","playing"],1,"Third person singular present: 'he plays'.","Agreement"],
["I ___ my keys yesterday.",["lose","lost","losed"],1,"Past tense of 'lose' is 'lost'.","Tenses"],
["There ___ many books on the shelf.",["is","are","was"],1,"'many books' is plural, so 'are'.","Agreement"],
["She is taller ___ her brother.",["then","than","that"],1,"Use 'than' for comparisons.","Confusions"],
["Would you like ___ orange or ___ pear?",["a, a","an, a","an, an"],1,"'an orange' (vowel), 'a pear' (consonant).","Articles"],
["Please be ___ during the test.",["quiet","quite","quit"],0,"'quiet' means silent; 'quite' means fairly.","Confusions"]
];

// ---- 44 phonemes: group -> [key, ipa, spellings, exampleWords] ----
export const PHON: [string, string[][]][] = [
["Short vowels",[["a","/ae/","a","cat, apple, hand, flag"],["e","/e/","e, ea","bed, hen, head, bread"],["i","/i/","i, y","sit, big, gym, myth"],["o","/o/","o, a","hot, dog, want, wash"],["u","/u/","u, o, ou","cup, sun, love, touch"],["oo","/oo/","oo, u, oul","book, put, bull, could"],["schwa","/a/","a, er, o","about, teacher, doctor, lemon"]]],
["Long vowels",[["ay","/ay/","a-e, ai, ay, eigh","cake, rain, day, eight"],["ee","/ee/","ee, ea, e-e, y","see, sea, these, happy"],["igh","/igh/","i-e, igh, y, ie","bike, light, my, pie"],["oa","/oa/","o-e, oa, ow, o","home, boat, snow, gold"],["oo","/oo/","oo, u-e, ew, ue","moon, tube, new, blue"],["or","/or/","or, aw, au, al","fork, saw, sauce, talk"],["ar","/ar/","ar, a","car, star, father, fast"],["ur","/ur/","er, ir, ur, or","her, bird, turn, word"]]],
["Diphthongs & r-controlled",[["ow","/ow/","ow, ou","cow, now, out, house"],["oi","/oi/","oi, oy","coin, boil, boy, toy"],["ear","/ear/","ear, eer, ere","ear, deer, here, cheer"],["air","/air/","air, are, ear","air, care, bear, chair"],["ure","/ure/","ure, our","cure, pure, tour"]]],
["Consonants",[["b","/b/","b, bb","bat, rabbit, cub"],["d","/d/","d, dd, ed","dog, add, filled"],["f","/f/","f, ff, ph, gh","fish, off, phone, laugh"],["g","/g/","g, gg","goat, egg, bag"],["h","/h/","h","hat, home, ahead"],["j","/j/","j, g, ge, dge","jam, giant, cage, bridge"],["k","/k/","c, k, ck, ch","cat, key, duck, school"],["l","/l/","l, ll","leg, bell, apple"],["m","/m/","m, mm, mb","man, hammer, thumb"],["n","/n/","n, nn, kn, gn","net, dinner, knee, gnome"],["ng","/ng/","ng, n","sing, ring, sink"],["p","/p/","p, pp","pig, apple, top"],["r","/r/","r, rr, wr","rat, carrot, write"],["s","/s/","s, ss, c, ce","sun, dress, city, face"],["t","/t/","t, tt","top, letter, cat"],["v","/v/","v, ve","van, give, love"],["w","/w/","w, wh","wet, wheel, when"],["y","/y/","y, u","yes, yellow, use"],["z","/z/","z, zz, s, se","zip, buzz, nose, is"],["ch","/ch/","ch, tch","chip, chair, watch"],["sh","/sh/","sh, ti, ci, ss","ship, station, special, mission"],["zh","/zh/","s, si, ge","treasure, vision, beige"],["th","/th/","th (unvoiced)","thin, bath, teeth"],["th","/th/","th (voiced)","this, that, mother"]]]
];

export const DEFAULT_LISTS: {[k:string]: string[]} = {
  "Tricky common words": ["because","friend","people","should","which","there","their","they're","would","could","enough","favourite","beautiful","different","important","interesting"],
  "Often misspelled (adult)": ["necessary","separate","definitely","embarrass","occurrence","rhythm","accommodate","believe","receive","business","conscience","environment","government","immediately","knowledge","maintenance","privilege","recommend","restaurant","tomorrow","vacuum","Wednesday","weird"],
  "Silent letters": ["knee","knife","wrist","write","lamb","thumb","comb","island","castle","listen","honest","hour","gnome","sign","muscle","science"],
  "Homophones": ["hear","here","there","their","they're","to","too","two","your","you're","weather","whether","piece","peace","break","brake"]
};

// ---- Pronunciation overrides ----
// If the voice says a word unclearly or with the wrong sense, map it here to a
// clearer spoken form (a respelling the TTS reads better). Keys are lower-case.
// The written word the learner must spell is unchanged — only the audio changes.
// Example: "wound": "woond"  (so it isn't read as an injury)
export const SPEAK_AS: {[k:string]: string} = {
  "glad": "gladd",   // endpoint mis-said final /d/ as "g" (glag); doubled d renders a clean /glad/
};

// ---- grapheme splitting + sound hints ----
export const DIGRAPHS = ["ssion","tion","sion","cian","ture","eigh","augh","ould","igh","air","ear","eer","ere","ure","are","tch","dge","sh","ch","th","ph","wh","ck","ng","qu","kn","wr","gn","mb","ai","ay","ea","ee","ey","ie","oa","oe","oo","ou","ow","oi","oy","ue","ew","au","aw","ar","er","ir","or","ur","ss","ll","ff","zz","tt","pp","nn","mm","dd","rr","bb","gg"].sort((a,b)=>b.length-a.length);

export const VOWELS = "aeiouy";

// Sound-out hints are strings fed to Google TTS, so they must be spellings the voice
// renders as the *sound*, not the letter name. Verified against the tw-ob endpoint:
//   - a/e/i/o/u alone are read as letter names (ay, ee, eye, oh, you) -> short-vowel carriers instead
//   - "buh/tuh/kuh" are read as "boo/too/koo"; "<consonant>ah" gives a clean open syllable
//   - "ay" is read as "aye" (/ai/); a bare "a" is the /ay/ letter name we want for ai/ay/eigh
//   - "ff", "kss", "kwuh", "zz" get spelled out letter by letter
export const SOUND_HINT: {[k:string]: string} = {
  // short vowels (soft nasal tail keeps the vowel short; "ah" = the o in hot)
  a:"an", e:"en", i:"in", o:"ah", u:"um",
  // single consonants
  b:"bah",c:"kah",d:"dah",f:"fah",g:"gah",h:"huh",j:"jah",k:"kah",l:"lah",m:"mah",n:"nah",
  p:"pah",q:"kwah",r:"rah",s:"sah",t:"tah",v:"vah",w:"wah",x:"x",y:"yah",z:"zah",
  // consonant digraphs / doubles
  sh:"shah",ch:"chah",th:"thah",ph:"fah",wh:"wah",ck:"kah",ng:"ng",qu:"kwah",tch:"chah",dge:"jah",
  kn:"nah",wr:"rah",gn:"nah",mb:"mah",ss:"sah",ll:"lah",ff:"fah",zz:"zah",tt:"tah",pp:"pah",
  nn:"nah",mm:"mah",dd:"dah",rr:"rah",bb:"bah",gg:"gah",
  // vowel teams / endings
  ssion:"shun",tion:"shun",sion:"zhun",cian:"shun",ture:"cher",eigh:"a",augh:"or",ould:"ood",
  igh:"eye",air:"air",are:"air",ear:"eer",eer:"eer",ere:"eer",ure:"yoor",
  ai:"a",ay:"a",ea:"ee",ee:"ee",ey:"ee",ie:"ee",oa:"oh",oe:"oh",oo:"oo",ou:"ow",ow:"ow",
  oi:"oy",oy:"oy",ue:"oo",ew:"oo",au:"or",aw:"or",ar:"ar",er:"er",ir:"er",or:"or",ur:"er"
};

export function splitGraphemes(word: string): string[] {
  const w = word.toLowerCase(); const out: string[] = []; let i = 0;
  while (i < w.length) {
    let m: string | null = null;
    for (const g of DIGRAPHS) { if (w.startsWith(g, i)) { m = g; break; } }
    if (m) { out.push(m); i += m.length; } else { out.push(w[i]); i++; }
  }
  return out;
}
export const isVowelChunk = (g: string) => [...g].some(c => VOWELS.includes(c));
export const soundFor = (c: string) => SOUND_HINT[c] || c;
