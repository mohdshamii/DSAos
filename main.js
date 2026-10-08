'use strict';
/* =========================================================
   DSA OS — single-file app logic.
   Sections: 1 Dataset · 2 Patterns · 3 State/Storage · 4 Utils ·
   5 Intelligence · 6 Recommendation · 7 Revision · 8 Analytics ·
   9 UI · 10 Views · 11 Events · 12 Init
   ========================================================= */

/* ---------- 1. PROBLEM DATASET (250 problems, PDF order) ---------- */
const TOPICS = [
['Arrays',['Hash Map'],'EEMMME'+'M'.repeat(11)+'HE'+'MMM','1:Two Sum|217:Contains Duplicate|238:Product of Array Except Self|53:Maximum Subarray (Kadane\'s)|152:Maximum Product Subarray|121:Best Time to Buy and Sell Stock|153:Find Minimum in Rotated Sorted Array|33:Search in Rotated Sorted Array|15:3Sum|11:Container With Most Water|56:Merge Intervals|57:Insert Interval|435:Non-overlapping Intervals|31:Next Permutation|73:Set Matrix Zeroes|54:Spiral Matrix|48:Rotate Image|42:Trapping Rain Water|169:Majority Element|75:Sort Colors|134:Gas Station|560:Subarray Sum Equals K'],
['Strings',['Hash Map'],'EEEMMMMMEMEHMMMMMM','242:Valid Anagram|20:Valid Parentheses|125:Valid Palindrome|3:Longest Substring Without Repeating Characters|5:Longest Palindromic Substring|647:Palindromic Substrings|49:Group Anagrams|271:Encode and Decode Strings|14:Longest Common Prefix|8:String to Integer (atoi)|28:Find the Index of the First Occurrence (strStr)|76:Minimum Window Substring|424:Longest Repeating Character Replacement|6:Zigzag Conversion|165:Compare Version Numbers|151:Reverse Words in a String|139:Word Break|91:Decode Ways'],
['Two Pointers & Sliding Window',['Sliding Window'],'MEEHMMMMMMMM','167:Two Sum II - Input Array Is Sorted|26:Remove Duplicates from Sorted Array|283:Move Zeroes|239:Sliding Window Maximum|567:Permutation in String|438:Find All Anagrams in a String|904:Fruit Into Baskets|340:Longest Substring with At Most K Distinct Characters|1004:Max Consecutive Ones III|209:Minimum Size Subarray Sum|16:3Sum Closest|881:Boats to Save People'],
['Linked List',['Fast & Slow Pointer'],'EEEMMHMMMEEMMMM','206:Reverse Linked List|21:Merge Two Sorted Lists|141:Linked List Cycle|19:Remove Nth Node From End of List|143:Reorder List|23:Merge k Sorted Lists|138:Copy List with Random Pointer|2:Add Two Numbers|142:Linked List Cycle II|234:Palindrome Linked List|160:Intersection of Two Linked Lists|430:Flatten a Multilevel Doubly Linked List|61:Rotate List|328:Odd Even Linked List|24:Swap Nodes in Pairs'],
['Stack & Queue',['Stack'],'MMMMMHEMEEMEH','155:Min Stack|150:Evaluate Reverse Polish Notation|22:Generate Parentheses|739:Daily Temperatures|853:Car Fleet|84:Largest Rectangle in Histogram|496:Next Greater Element I|503:Next Greater Element II|232:Implement Queue using Stacks|225:Implement Stack using Queues|735:Asteroid Collision|1047:Remove All Adjacent Duplicates In String|224:Basic Calculator'],
['Binary Search',['Binary Search'],'EMMMMHHMMEMMM','704:Binary Search|74:Search a 2D Matrix|875:Koko Eating Bananas|34:Find First and Last Position of Element in Sorted Array|81:Search in Rotated Sorted Array II|4:Median of Two Sorted Arrays|410:Split Array Largest Sum|1011:Capacity To Ship Packages Within D Days|162:Find Peak Element|69:Sqrt(x)|378:Kth Smallest Element in a Sorted Matrix|658:Find K Closest Elements|540:Single Element in a Sorted Array'],
['Recursion & Backtracking',['Backtracking'],'MMMMMMMMHHMMMMH','78:Subsets|90:Subsets II|46:Permutations|47:Permutations II|39:Combination Sum|40:Combination Sum II|79:Word Search|131:Palindrome Partitioning|51:N-Queens|37:Sudoku Solver|17:Letter Combinations of a Phone Number|77:Combinations|93:Restore IP Addresses|526:Beautiful Arrangement|282:Expression Add Operators'],
['Trees',['Tree Traversal','DFS'],'EEEEEE'+'M'.repeat(8)+'HHE'+'MMMM'+'HMEM','226:Invert Binary Tree|104:Maximum Depth of Binary Tree|543:Diameter of Binary Tree|110:Balanced Binary Tree|100:Same Tree|572:Subtree of Another Tree|235:Lowest Common Ancestor of a BST|236:Lowest Common Ancestor of a Binary Tree|102:Binary Tree Level Order Traversal|199:Binary Tree Right Side View|1448:Count Good Nodes in Binary Tree|98:Validate Binary Search Tree|230:Kth Smallest Element in a BST|105:Construct Binary Tree from Preorder and Inorder Traversal|124:Binary Tree Maximum Path Sum|297:Serialize and Deserialize Binary Tree|112:Path Sum|113:Path Sum II|114:Flatten Binary Tree to Linked List|103:Binary Tree Zigzag Level Order Traversal|116:Populating Next Right Pointers in Each Node|987:Vertical Order Traversal of a Binary Tree|545:Boundary of Binary Tree|101:Symmetric Tree|129:Sum Root to Leaf Numbers'],
['Binary Search Tree',['Tree Traversal'],'MMEEMMEE','701:Insert into a Binary Search Tree|450:Delete Node in a BST|108:Convert Sorted Array to Binary Search Tree|653:Two Sum IV - Input is a BST|669:Trim a Binary Search Tree|99:Recover Binary Search Tree|938:Range Sum of BST|530:Minimum Absolute Difference in BST'],
['Heap / Priority Queue',['Heap'],'MMMMHEMEMMMH','215:Kth Largest Element in an Array|347:Top K Frequent Elements|973:K Closest Points to Origin|621:Task Scheduler|295:Find Median from Data Stream|1046:Last Stone Weight|767:Reorganize String|703:Kth Largest Element in a Stream|264:Ugly Number II|253:Meeting Rooms II|355:Design Twitter|632:Smallest Range Covering Elements from K Lists'],
['Graphs',['DFS','BFS'],'M'.repeat(11)+'HMHHH'+'M'.repeat(6)+'HHM','200:Number of Islands|133:Clone Graph|695:Max Area of Island|417:Pacific Atlantic Water Flow|130:Surrounded Regions|994:Rotting Oranges|207:Course Schedule|210:Course Schedule II|684:Redundant Connection|785:Is Graph Bipartite?|743:Network Delay Time|332:Reconstruct Itinerary|1584:Min Cost to Connect All Points|778:Swim in Rising Water|127:Word Ladder|126:Word Ladder II|787:Cheapest Flights Within K Stops|399:Evaluate Division|547:Number of Provinces|721:Accounts Merge|797:All Paths From Source to Target|1091:Shortest Path in Binary Matrix|815:Bus Routes|1192:Critical Connections in a Network|1334:Find the City With the Smallest Number of Neighbors at a Threshold Distance'],
['Dynamic Programming',['Dynamic Programming'],'E'+'M'.repeat(12)+'H'+'MMM'+'HHH'+'MM'+'HHHHH'+'MHM','70:Climbing Stairs|198:House Robber|213:House Robber II|300:Longest Increasing Subsequence|322:Coin Change|518:Coin Change II|416:Partition Equal Subset Sum|62:Unique Paths|63:Unique Paths II|1143:Longest Common Subsequence|72:Edit Distance|97:Interleaving String|516:Longest Palindromic Subsequence|140:Word Break II|377:Combination Sum IV|494:Target Sum|309:Best Time to Buy and Sell Stock with Cooldown|123:Best Time to Buy and Sell Stock III|188:Best Time to Buy and Sell Stock IV|1235:Maximum Profit in Job Scheduling|64:Minimum Path Sum|120:Triangle|174:Dungeon Game|10:Regular Expression Matching|44:Wildcard Matching|115:Distinct Subsequences|312:Burst Balloons|279:Perfect Squares|887:Super Egg Drop|221:Maximal Square'],
['Greedy',['Greedy'],'MMMMMMMHEEM','55:Jump Game|45:Jump Game II|846:Hand of Straights|1899:Merge Triplets to Form Target Triplet|763:Partition Labels|678:Valid Parenthesis String|452:Minimum Number of Arrows to Burst Balloons|135:Candy|455:Assign Cookies|860:Lemonade Change|406:Queue Reconstruction by Height'],
['Trie',['Trie'],'MMHMM','208:Implement Trie (Prefix Tree)|211:Design Add and Search Words Data Structure|212:Word Search II|648:Replace Words|421:Maximum XOR of Two Numbers in an Array'],
['Bit Manipulation',['Bit Manipulation'],'EMEEEEME','136:Single Number|137:Single Number II|191:Number of 1 Bits|338:Counting Bits|190:Reverse Bits|268:Missing Number|371:Sum of Two Integers|231:Power of Two'],
['Matrix',['Simulation'],'MMMMMEE','498:Diagonal Traverse|240:Search a 2D Matrix II|59:Spiral Matrix II|289:Game of Life|36:Valid Sudoku|766:Toeplitz Matrix|867:Transpose Matrix'],
['Design',['Hash Map'],'MHEEMMMMMMM','146:LRU Cache|460:LFU Cache|706:Design HashMap|705:Design HashSet|380:Insert Delete GetRandom O(1)|622:Design Circular Queue|981:Time Based Key-Value Store|1396:Design Underground System|449:Serialize and Deserialize BST|1381:Design a Stack With Increment Operation|353:Design Snake Game']
];
const EXPECT = [22,18,12,15,13,13,15,25,8,12,25,30,11,5,8,7,11];
const SLUG_FIX = {53:'maximum-subarray',28:'find-the-index-of-the-first-occurrence-in-a-string',235:'lowest-common-ancestor-of-a-binary-search-tree'};
const PAT_FIX = {1:['Hash Map'],217:['Hash Map'],238:['Prefix Sum'],560:['Prefix Sum','Hash Map'],53:['Dynamic Programming'],152:['Dynamic Programming'],121:['Greedy'],153:['Binary Search'],33:['Binary Search'],15:['Two Pointers'],11:['Two Pointers'],56:['Intervals'],57:['Intervals'],435:['Intervals','Greedy'],42:['Two Pointers','Monotonic Stack'],134:['Greedy'],75:['Two Pointers'],169:['Hash Map'],54:['Simulation'],48:['Simulation'],73:['Simulation'],31:['Two Pointers'],
20:['Stack'],125:['Two Pointers'],3:['Sliding Window'],76:['Sliding Window'],424:['Sliding Window'],139:['Dynamic Programming'],91:['Dynamic Programming'],5:['Dynamic Programming'],647:['Dynamic Programming'],28:['Two Pointers'],
167:['Two Pointers'],26:['Two Pointers'],283:['Two Pointers'],16:['Two Pointers'],881:['Two Pointers','Greedy'],239:['Sliding Window','Monotonic Stack'],
23:['Heap'],19:['Two Pointers'],206:['Simulation'],21:['Two Pointers'],
739:['Monotonic Stack'],853:['Monotonic Stack'],84:['Monotonic Stack'],496:['Monotonic Stack'],503:['Monotonic Stack'],232:['Queue'],225:['Queue'],22:['Backtracking'],
704:['Binary Search'],4:['Binary Search','Divide and Conquer'],
102:['BFS'],199:['BFS'],103:['BFS'],116:['BFS'],297:['BFS','DFS'],
215:['Heap'],347:['Heap','Hash Map'],253:['Heap','Intervals'],
207:['Topological Sort','DFS'],210:['Topological Sort','BFS'],684:['Union Find'],547:['Union Find','DFS'],721:['Union Find'],1584:['Union Find'],994:['BFS'],127:['BFS'],126:['BFS'],1091:['BFS'],815:['BFS'],743:['Heap','BFS'],787:['BFS'],778:['Heap'],
55:['Greedy'],146:['Hash Map'],460:['Hash Map'],622:['Queue'],208:['Trie'],136:['Bit Manipulation'],421:['Trie','Bit Manipulation'],
70:['Dynamic Programming'],198:['Dynamic Programming'],279:['Dynamic Programming','BFS'],300:['Dynamic Programming','Binary Search'],23:['Heap']};
const slugify = t => t.toLowerCase().replace(/['’()?,]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const DIFF = {E:'Easy',M:'Medium',H:'Hard'};
const PROBLEMS = [];
TOPICS.forEach(([topic,defPat,ds,list],ti)=>list.split('|').forEach((s,i)=>{
  const k=s.indexOf(':'), lc=+s.slice(0,k), title=s.slice(k+1), slug=SLUG_FIX[lc]||slugify(title);
  PROBLEMS.push({id:PROBLEMS.length+1,lcNumber:lc,title,topic,ti,difficulty:DIFF[ds[i]],slug,url:'https://leetcode.com/problems/'+slug+'/',patterns:PAT_FIX[lc]||defPat,tags:[topic,DIFF[ds[i]],...(PAT_FIX[lc]||defPat)]});
}));
const BYTOPIC = {}; TOPICS.forEach(t=>BYTOPIC[t[0]]=PROBLEMS.filter(p=>p.topic===t[0]));
const PRIORITY = ['Arrays','Strings','Trees','Graphs','Dynamic Programming','Recursion & Backtracking'];

function validate(){
  const w=[];
  if(PROBLEMS.length!==250) w.push('Expected 250 problems, found '+PROBLEMS.length);
  if(new Set(PROBLEMS.map(p=>p.lcNumber)).size!==PROBLEMS.length) w.push('Duplicate LeetCode numbers');
  if(TOPICS.length!==17) w.push('Expected 17 topics');
  TOPICS.forEach((t,i)=>{const n=BYTOPIC[t[0]].length; if(n!==EXPECT[i]) w.push(t[0]+': expected '+EXPECT[i]+', found '+n); if(t[2].length!==n) w.push(t[0]+': difficulty map length mismatch');});
  PROBLEMS.forEach(p=>{if(!p.title||!/^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/$/.test(p.url)) w.push('Bad record #'+p.lcNumber)});
  return w;
}

/* ---------- 2. PATTERN METADATA: [question1, question2, question3, concept, complexity] ---------- */
const PAT = {
'Hash Map':['What must you remember about elements you have already seen?','What is the key and what is the value?','Could one pass with instant lookup replace a nested loop?','Trade memory for speed: store what you have seen so every check is O(1).','Usually O(n) time, O(n) space'],
'Prefix Sum':['What running quantity would let you answer a range question instantly?','What does prefix[j] - prefix[i] represent?','Can a map of earlier prefix values find matching ranges?','Precompute cumulative totals so any range becomes a subtraction.','O(n) time, O(n) space'],
'Two Pointers':['What if two indices moved toward each other (or together)?','What tells you which pointer to move?','Does sorting or an invariant justify discarding candidates?','Two indices exploit order or structure to avoid checking all pairs.','O(n) after any sort; O(1) space'],
'Sliding Window':['What defines a valid window?','When do you grow it, and when must you shrink it?','What do you track as the window moves, so you never recompute?','Maintain a moving range and update its state incrementally.','O(n) time; space depends on window state'],
'Binary Search':['What is monotonic here — an array, or an answer space?','What condition splits the search range in half?','What are the exact loop invariant and boundary update?','Halve a search space using a monotonic predicate.','O(log n) (times cost of the check)'],
'Fast & Slow Pointer':['What if two pointers moved at different speeds?','What does the meeting point or gap tell you?','Which node do you need to stop at to splice safely?','Pointers at different speeds reveal cycles, midpoints and gaps without extra memory.','O(n) time, O(1) space'],
'Stack':['What must be resolved in last-in-first-out order?','What do you push, and what triggers a pop?','What does the stack look like when the input ends?','A stack keeps unfinished work and resolves the newest first.','O(n) time, O(n) space'],
'Monotonic Stack':['For each element, which neighbour matters (next greater/smaller)?','Which elements can never be an answer again once a bigger one appears?','Should the stack be increasing or decreasing?','Keep a sorted stack so each element is pushed and popped once.','O(n) time, O(n) space'],
'Queue':['What must be processed in first-in-first-out order?','Which operation costs extra, and can you amortize it?','Could two stacks (or a circular buffer) do this?','Queues model ordered processing; amortized tricks cut cost.','Amortized O(1) per operation'],
'BFS':['Do you need the shortest path or level-by-level order?','What is a node/state here, and how do you avoid revisiting?','What goes into the queue, and when do you mark visited?','Explore in layers so the first arrival is the shortest route.','O(V+E) time, O(V) space'],
'DFS':['What can you learn about a subtree/component before returning?','What does the recursive function return, and what state does it carry?','What is the base case, and how do you avoid revisiting?','Go deep, combine child answers, mark visited to avoid cycles.','O(V+E) time, O(depth) space'],
'Backtracking':['What choice do you make at each step?','What is the stopping condition, and how do you undo a choice?','How do you prune branches that cannot succeed or duplicate?','Build candidates incrementally, undo, and prune the search tree.','Exponential, pruned (e.g. O(n·2^n))'],
'Heap':['What do you repeatedly need — the min or the max?','Do you need all items sorted, or only the top k?','What size should the heap be capped at?','A heap gives the best remaining item in O(log n).','O(n log k) time, O(k) space'],
'Greedy':['Is there a locally best choice that never hurts later?','Can you sort by some key to make that choice obvious?','Can you argue why the greedy choice is safe (exchange argument)?','Commit to the locally best move when it provably cannot be regretted.','Often O(n log n) from sorting'],
'Dynamic Programming':['What is the smallest version of this problem?','What exactly does dp[i] (or dp[i][j]) mean?','How does a state follow from smaller states — and what are the base cases?','Define a state, write the transition, reuse overlapping subproblems.','O(states × transitions)'],
'Union Find':['Do you only need to know whether things are connected?','What gets merged, and what is the representative?','How do path compression and union by rank keep it fast?','Track connected components under merges in near-constant time.','~O(α(n)) per operation'],
'Topological Sort':['Are there dependencies or an ordering between items?','What does it mean if some nodes can never reach in-degree zero?','Could you repeatedly remove nodes with no prerequisites?','Order a DAG so prerequisites come first; leftover nodes mean a cycle.','O(V+E) time and space'],
'Trie':['What do many strings share that you keep re-comparing?','What does each node need to store?','How do you mark the end of a word versus a prefix?','A prefix tree shares common prefixes for fast lookup.','O(L) per word/query'],
'Bit Manipulation':['What do XOR, AND and shifts do to a pair of equal bits?','What happens when you combine a number with itself?','Can n & (n-1) or a mask express this?','Use bit tricks (XOR cancels pairs) to get O(1) space.','O(1) space; O(bits) or O(n) time'],
'Intervals':['What happens if you sort by start (or end)?','When do two intervals overlap?','What do you track while sweeping through them?','Sort, then sweep merging or counting overlaps.','O(n log n) time'],
'Divide and Conquer':['Can you split the input into independent halves?','How do you combine the two half-answers?','What is the smallest input you can answer directly?','Split, solve, merge — or discard half.','Usually O(n log n) or O(log n)'],
'Tree Traversal':['Which traversal order gives you what you need (pre / in / post / level)?','What must a node know from above, and what must it report from below?','What property of the tree (e.g. BST ordering) can you exploit?','Choose the traversal whose visiting order matches the question.','O(n) time, O(h) space'],
'Simulation':['Can you describe the process step by step?','What are the boundaries and the direction changes?','Can you do it in place with a clever ordering?','Carefully reproduce the process; most bugs are boundary conditions.','Usually O(rows × cols)']
};
const ALL_PATTERNS = Object.keys(PAT);
const MISTAKES = ["Didn't understand","Wrong approach","TLE","Wrong answer","Edge case","Syntax / implementation","Forgot pattern","Forgot concept","Couldn't optimize"];

/* ---------- 3. STATE + LOCALSTORAGE ---------- */
const KEY='dsaos.v1';
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.p)return s}catch(e){}return {p:{},days:{},ints:[],xp:0,theme:'dark',sess:null,iv:null}}
let S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Could not save — storage is blocked or full. Export your progress.')}}
const rec=id=>S.p[id]||{};
const ens=id=>S.p[id]||(S.p[id]={st:'todo',conf:0,att:[],j:{},iv:0});
const isSolved=id=>rec(id).st==='solved';

/* ---------- 4. UTILITIES ---------- */
const DAY=864e5, IV=[1,3,7,14,30,60];
const iso=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const today=()=>iso(Date.now());
const dd=s=>new Date(s+'T00:00:00');
const ago=s=>Math.round((dd(today())-dd(s))/DAY);
const addDays=(s,n)=>{const x=dd(s);x.setDate(x.getDate()+n);return iso(x)};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=x=>Math.round(Math.max(0,Math.min(1,x))*100);
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const $=(s,r)=>(r||document).querySelector(s);
const dcls=d=>d==='Easy'?'e':d==='Medium'?'m':'h';
const bar=(v,c)=>`<div class="bar ${c||''}" role="progressbar" aria-valuenow="${pct(v)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct(v)}%"></i></div>`;
const brow=(l,v,extra)=>`<div class="brow"><span>${esc(l)}</span>${bar(v)}<span>${extra||pct(v)+'%'}</span></div>`;
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),3200)}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function mmss(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return(h?h+':':'')+String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function logDay(n,min,rev){const d=S.days[today()]||(S.days[today()]={n:0,min:0,rev:0});if(!d.n&&!d.min&&!d.rev&&streak()>=3){S.xp+=5}d.n+=n;d.min=Math.round((d.min+min)*10)/10;d.rev+=rev}

/* ---------- 5. INTELLIGENCE ENGINE ---------- */
const stab=r=>IV[r.iv||0]*2.5*(.5+(r.conf||3)/5);
function mem(id){const r=rec(id);if(r.st!=='solved')return 0;return Math.round(100*Math.exp(-ago(r.last)/stab(r))*(.5+.5*(r.conf||3)/5))}
function attempts(){const a=[];PROBLEMS.forEach(p=>(rec(p.id).att||[]).forEach(x=>a.push({...x,p})));return a}
function topicStat(t){const ps=BYTOPIC[t];let s=0,c=[],tm=[],last=null,att=0,ok=0;
  ps.forEach(p=>{const r=rec(p.id);if(r.st==='solved'){s++;c.push(r.conf||3)}(r.att||[]).forEach(a=>{tm.push(a.min);att++;if(a.ok)ok++;if(!last||a.d>last)last=a.d})});
  return{total:ps.length,solved:s,pct:s/ps.length,conf:avg(c),avgMin:avg(tm),last,att,ok,mem:avg(ps.map(p=>mem(p.id)))/100}}
function patStat(pt){const ps=PROBLEMS.filter(p=>p.patterns.includes(pt));let att=0,ok=0,solved=0,tm=[];
  ps.forEach(p=>{const r=rec(p.id);if(r.st==='solved')solved++;(r.att||[]).forEach(a=>{att++;if(a.ok)ok++;tm.push(a.min)})});
  const m=avg(ps.map(p=>mem(p.id)))/100;return{pt,total:ps.length,solved,att,ok,mastery:m,success:att?ok/att:0,avgMin:avg(tm)}}
function diffStat(d){const ps=PROBLEMS.filter(p=>p.difficulty===d);let att=0,ok=0,solved=0,tm=[];
  ps.forEach(p=>{const r=rec(p.id);if(r.st==='solved')solved++;(r.att||[]).forEach(a=>{att++;if(a.ok)ok++;tm.push(a.min)})});return{total:ps.length,solved,att,ok,success:att?ok/att:0,avgMin:avg(tm)}}
function streak(){let n=0,d=today();if(!(S.days[d]&&(S.days[d].n||S.days[d].min||S.days[d].rev)))d=addDays(d,-1);
  while(S.days[d]&&(S.days[d].n||S.days[d].min||S.days[d].rev)){n++;d=addDays(d,-1)}return n}
function activeDays(n){let c=0;for(let i=0;i<n;i++){const x=S.days[addDays(today(),-i)];if(x&&(x.n||x.min||x.rev))c++}return c}
function mistakeStats(){const c={};let t=0;attempts().forEach(a=>(a.mist||[]).forEach(m=>{c[m]=(c[m]||0)+1;t++}));
  return Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({k,v,p:v/t}))}
function revData(){const o={over:[],today:[],up:[],master:[]};PROBLEMS.forEach(p=>{const r=rec(p.id);if(r.st!=='solved'||!r.due)return;
  if(r.due<today())o.over.push(p);else if(r.due===today())o.today.push(p);else if((r.iv||0)>=4&&(r.conf||0)>=4)o.master.push(p);else o.up.push(p)});return o}
function revSuccess(){let n=0,ok=0;PROBLEMS.forEach(p=>{const r=rec(p.id);n+=r.rev||0;ok+=r.revOk||0});return{n,ok,rate:n?ok/n:null}}
function solvedCount(){return PROBLEMS.filter(p=>isSolved(p.id)).length}
function health(){
  const sc=solvedCount(),rv=revData(),at=attempts(),ok=at.filter(a=>a.ok).length;
  const conf=avg(PROBLEMS.filter(p=>isSolved(p.id)).map(p=>rec(p.id).conf||3))/5;
  const touched=TOPICS.filter(t=>topicStat(t[0]).solved>0).length/17;
  const med=PROBLEMS.filter(p=>isSolved(p.id)&&p.difficulty!=='Easy').length;
  const parts=[
   {n:'Completion',w:20,v:sc/250,d:sc+' of 250 solved'},
   {n:'Consistency',w:20,v:activeDays(14)/14,d:activeDays(14)+' active days in the last 14'},
   {n:'Revision discipline',w:15,v:sc?1-Math.min(1,rv.over.length/Math.max(3,sc*.3)):0,d:rv.over.length+' overdue revisions'},
   {n:'Success rate',w:15,v:at.length?ok/at.length:0,d:at.length?ok+' of '+at.length+' attempts succeeded':'No attempts yet'},
   {n:'Confidence',w:10,v:conf,d:'Average confidence on solved problems'},
   {n:'Topic balance',w:10,v:touched,d:Math.round(touched*17)+' of 17 topics started'},
   {n:'Difficulty progression',w:10,v:sc?Math.min(1,med/Math.max(5,sc*.6)):0,d:med+' Medium/Hard solved'}];
  return{score:Math.round(parts.reduce((s,p)=>s+p.w*p.v,0)),parts}}
function readiness(){
  const sc=solvedCount(),h=health(),rv=revData(),pats=ALL_PATTERNS.map(patStat);
  const patCov=pats.filter(p=>p.mastery>=.4).length/pats.length;
  const hard=PROBLEMS.filter(p=>isSolved(p.id)&&p.difficulty!=='Easy').length/150;
  const iv=avg(S.ints.slice(-5).map(i=>i.score))/100;
  const weak=TOPICS.map(t=>({t:t[0],s:topicStat(t[0])})).sort((a,b)=>a.s.pct-b.s.pct);
  const wcov=weak.filter(x=>x.s.pct>=.4).length/17;
  const parts=[
   {n:'Problem coverage',w:20,v:sc/250},{n:'Pattern coverage',w:15,v:patCov},{n:'Difficulty progression',w:10,v:Math.min(1,hard*1.5)},
   {n:'Revision discipline',w:15,v:h.parts[2].v},{n:'Recent consistency',w:10,v:h.parts[1].v},{n:'Interview performance',w:15,v:iv},{n:'Confidence',w:5,v:h.parts[4].v},{n:'Weak-topic coverage',w:10,v:wcov}];
  const blockers=[...weak.slice(0,2).map(x=>x.t)];
  if(iv<.5)blockers.push('Timed interview practice');if(rv.over.length>3)blockers.push('Overdue revisions');
  return{score:Math.round(parts.reduce((s,p)=>s+p.w*p.v,0)),parts,blockers:blockers.slice(0,3)}}
const LEVELS=['Beginner','Explorer','Problem Solver','Pattern Hunter','Interview Ready','DSA Warrior','Algorithm Engineer','Placement Ready','Elite','Master'];
const XPT=[0,50,150,300,500,800,1200,1800,2600,3600];
function level(){let l=0;XPT.forEach((x,i)=>{if(S.xp>=x)l=i});const nx=XPT[l+1];return{l:l+1,name:LEVELS[l],xp:S.xp,next:nx,p:nx?(S.xp-XPT[l])/(nx-XPT[l]):1}}
const XPD={Easy:10,Medium:20,Hard:40};

/* ---------- 6. RECOMMENDATION ENGINE ---------- */
function targetDiff(){const m=diffStat('Medium'),sc=solvedCount();
  if(sc<12)return'Easy';if(m.solved>=20&&m.att>=8&&m.success>=.7)return'Hard';return'Medium'}
function scoreProblem(p,tCache,pCache){
  const r=rec(p.id),ts=tCache[p.topic],reasons=[];let s=0;
  if(r.st==='solved'){if(!r.due||r.due>today())return null;const od=ago(r.due);s=60+od*3+(5-(r.conf||3))*4;
    reasons.push(od>0?`Revision overdue by ${od} day${od>1?'s':''}`:'Revision is due today',`Confidence on this one is ${r.conf||3}/5`,`Estimated memory strength ${mem(p.id)}%`);return{p,s,reasons}}
  const weak=(1-ts.pct)*20;s+=weak;if(ts.pct<.3)reasons.push(`${p.topic} is one of your least-covered topics (${ts.solved}/${ts.total})`);
  if(PRIORITY.includes(p.topic)){s+=8;reasons.push(`${p.topic} is a high-priority topic for MNC rounds`)}
  const rc=ts.last?Math.min(14,ago(ts.last)):14;s+=rc*1.2;reasons.push(ts.last?(rc>=3?`You haven't practiced ${p.topic} for ${ago(ts.last)} days`:`Recent ${p.topic} practice keeps the momentum`):`You have not started ${p.topic} yet`);
  const td=targetDiff(),order=['Easy','Medium','Hard'],gap=Math.abs(order.indexOf(td)-order.indexOf(p.difficulty));s+=gap===0?10:gap===1?4:0;if(gap===0)reasons.push(`${p.difficulty} matches your current level`);
  const pw=avg(p.patterns.map(x=>1-pCache[x].mastery));s+=pw*6;
  if((r.att||[]).some(a=>!a.ok)){s+=8;reasons.push('You attempted this before without solving it')}
  if(ts.conf&&ts.conf<3){s+=4;reasons.push(`Your confidence in ${p.topic} is low`)}
  s-=p.id*.01;return{p,s,reasons}}
function rank(filter){const tc={},pc={};TOPICS.forEach(t=>tc[t[0]]=topicStat(t[0]));ALL_PATTERNS.forEach(x=>pc[x]=patStat(x));
  return PROBLEMS.filter(p=>!filter||filter(p)).map(p=>scoreProblem(p,tc,pc)).filter(Boolean).sort((a,b)=>b.s-a.s)}
const nextBest=()=>rank()[0];

function coach(){
  const out=[],rv=revData(),at=attempts(),sc=solvedCount();
  if(!at.length&&!sc)return[{t:'info',h:'Your DSA journey starts here',b:'250 problems are waiting. Solve the recommended problem to teach the engine how you think — every insight below is computed from your own attempts.'}];
  if(rv.over.length>=5)out.push({t:'warn',h:`You have ${rv.over.length} overdue revisions`,b:'Avoid adding new problems until you clear at least 5 revisions — unreviewed problems decay fastest.'});
  else if(rv.over.length)out.push({t:'info',h:`${rv.over.length} revision${rv.over.length>1?'s are':' is'} overdue`,b:'Clearing these first keeps your retention curve healthy.'});
  TOPICS.map(t=>({t:t[0],s:topicStat(t[0])})).filter(x=>x.s.last&&ago(x.s.last)>=5).sort((a,b)=>ago(b.s.last)-ago(a.s.last)).slice(0,1).forEach(x=>{const recent=PROBLEMS.filter(p=>rec(p.id).last===today()||ago(rec(p.id).last||today())<3);
    out.push({t:'info',h:`${x.t} has been quiet for ${ago(x.s.last)} days`,b:`Your next problem should come from ${x.t} to avoid losing the pattern.`})});
  const un=TOPICS.filter(t=>topicStat(t[0]).att===0&&PRIORITY.includes(t[0])).map(t=>t[0]);
  if(sc>=3&&un.length)out.push({t:'info',h:`Priority topics untouched: ${un.slice(0,3).join(', ')}`,b:'These dominate MNC rounds — schedule one problem each this week.'});
  TOPICS.map(t=>({t:t[0],s:topicStat(t[0])})).filter(x=>x.s.att>=3&&x.s.avgMin>25).slice(0,1).forEach(x=>out.push({t:'warn',h:`You average ${Math.round(x.s.avgMin)} minutes on ${x.t}`,b:'Start with an easier problem here and spend the first five minutes writing down the approach before coding.'}));
  const m=diffStat('Medium'),e=diffStat('Easy');
  if(m.att>=5)out.push(m.success>=.7?{t:'good',h:`Your Medium success rate is ${pct(m.success)}%`,b:"You're ready to gradually introduce Hard problems."}:{t:'info',h:`Your Medium success rate is ${pct(m.success)}%`,b:'Stay on Medium for the next 3 sessions before stepping up.'});
  if(e.att>=3&&m.att>=3&&m.avgMin>e.avgMin*2.5)out.push({t:'info',h:'Medium problems take you much longer than Easy',b:`Average ${Math.round(m.avgMin)} min vs ${Math.round(e.avgMin)} min. Practise Medium problems before raising difficulty.`});
  const ms=mistakeStats();if(ms.length&&ms[0].v>=2)out.push({t:'info',h:`Your most frequent mistake: ${ms[0].k} (${pct(ms[0].p)}%)`,b:mistakeTip(ms[0].k)});
  const rs=revSuccess();if(rs.n>=3)out.push(rs.rate>=.8?{t:'good',h:`Your revision success rate is ${pct(rs.rate)}%`,b:'Your retention system is working well.'}:{t:'warn',h:`Your revision success rate is ${pct(rs.rate)}%`,b:'Revisit concepts before re-solving: write the key insight from memory first.'});
  const low=PROBLEMS.filter(p=>isSolved(p.id)&&(rec(p.id).conf||3)<=2&&ago(rec(p.id).last)>=3)[0];
  if(low)out.push({t:'info',h:`#${low.lcNumber} ${low.title} needs another look`,b:`Solved ${ago(rec(low.id).last)} days ago with confidence ${rec(low.id).conf}/5.`});
  const st=streak();if(st>=3)out.push({t:'good',h:`${st}-day streak`,b:'Consistency is the strongest predictor of readiness — protect it today.'});
  return out.length?out.slice(0,6):[{t:'good',h:'Everything looks balanced',b:'Keep following the recommended problem and the engine will adapt.'}]}
function mistakeTip(k){return({"Didn't understand":'Re-read the statement, write one example by hand, then predict the output before coding.',"Wrong approach":'Write 2 candidate approaches and their complexity before choosing — use the thinking journal.',"TLE":'Estimate complexity against the constraints before coding; ask which repeated work can be cached.',"Wrong answer":'Trace your code on a tiny input by hand and compare with the expected result.',"Edge case":'Before submitting, test: empty, single element, duplicates, negatives, and maximum size.',"Syntax / implementation":'Practise writing the core template from memory for your language.',"Forgot pattern":'Do pattern-focused sets (same pattern, 3 problems in a row).',"Forgot concept":'Review the concept in Patterns, then redo an Easy problem that uses it.',"Couldn't optimize":'Start from brute force, name the bottleneck, then ask which pattern removes it.'})[k]||''}
function mission(){const rv=revData(),nr=Math.min(rv.over.length+rv.today.length,3),
  wp=ALL_PATTERNS.map(patStat).filter(p=>p.total>=3).sort((a,b)=>a.mastery-b.mastery)[0],d=S.days[today()]||{n:0,min:0,rev:0},nn=rv.over.length>=8?1:3;
  const done=d.wp||0;
  return[{t:`Solve ${nn} new problem${nn>1?'s':''}`,ok:d.n>=nn,v:`${Math.min(d.n,nn)}/${nn}`},
   ...(nr?[{t:`Revise ${nr} due problem${nr>1?'s':''}`,ok:d.rev>=nr,v:`${Math.min(d.rev,nr)}/${nr}`}]:[]),
   {t:`Practise a weak pattern: ${wp.pt}`,ok:!!done,v:done?'done':'—',pt:wp.pt},{t:'Study 30 minutes',ok:d.min>=30,v:Math.min(30,Math.round(d.min))+'/30 min'}]}

/* ---------- 7. REVISION ENGINE ---------- */
function schedule(r){const f=[.5,.7,1,1.2,1.5][(r.conf||3)-1];r.due=addDays(today(),Math.max(1,Math.round(IV[r.iv||0]*f)))}
function revise(id,ok){const r=ens(id);r.last=today();r.rev=(r.rev||0)+1;
  if(ok){r.revOk=(r.revOk||0)+1;r.iv=Math.min(5,(r.iv||0)+1)}else{r.iv=0;r.conf=Math.max(1,(r.conf||3)-1)}
  schedule(r);logDay(0,0,1);S.xp+=5;save();toast(ok?`Remembered — next review in ${ago(r.due)*-1} days`:'Marked forgotten — memory strength reset');}

/* ---------- 8. ANALYTICS ---------- */
function weekly(n){const out=[];for(let w=n-1;w>=0;w--){let c=0;for(let i=0;i<7;i++){const x=S.days[addDays(today(),-(w*7+i))];if(x)c+=x.n}out.push(c)}return out}
function heatmap(){const cells=[];const start=addDays(today(),-364);const off=dd(start).getDay();let svg='';
  for(let i=0;i<365;i++){const d=addDays(start,i),x=S.days[d]||{n:0,min:0,rev:0},v=x.n*2+x.rev+(x.min>=30?1:0),l=v===0?0:v<2?1:v<4?2:v<6?3:4,
    c=Math.floor((i+off)/7),r=(i+off)%7,nice=new Date(d+'T00:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
    svg+=`<rect class="l${l}" x="${c*14}" y="${r*14}" width="11" height="11"><title>${nice}: ${x.n} problems, ${Math.round(x.min)} minutes, ${x.rev} revisions</title></rect>`}
  return`<svg class="hm" viewBox="0 0 ${Math.ceil((365+off)/7)*14} 98" role="img" aria-label="365 day activity heatmap">${svg}</svg>`}

/* ---------- 9. SEARCH + UI HELPERS ---------- */
const ALIAS={dp:'dynamic programming',bst:'binary search tree',ll:'linked list',bs:'binary search',pq:'heap',bt:'backtracking',heap:'heap',e:'easy',m:'medium',h:'hard'};
function sub(q,t){let i=0;for(const c of t){if(c===q[i])i++;if(i===q.length)return true}return false}
function search(q){q=q.trim().toLowerCase();if(!q)return PROBLEMS;const tok=q.split(/\s+/).map(t=>ALIAS[t]||t);
  return PROBLEMS.filter(p=>{const hay=(p.lcNumber+' '+p.title+' '+p.topic+' '+p.patterns.join(' ')+' '+p.difficulty).toLowerCase();
    return tok.every(t=>hay.includes(t)||(t.length>3&&sub(t,hay)))})}
function debounce(f,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}}
function probRow(p,extra){const r=rec(p.id),st=r.st==='solved'?'<span class="e" title="Solved">●</span>':r.st==='attempted'?'<span class="m" title="Attempted">◐</span>':'<span class="mu" title="Not started">○</span>';
  return`<div class="row"><span aria-hidden="true">${st}</span><span class="num">#${p.lcNumber}</span><div class="t"><a href="#/session/${p.id}">${esc(p.title)}</a><div class="sm mu">${esc(p.topic)}</div></div><span class="tag ${dcls(p.difficulty)}">${p.difficulty}</span>${extra||`<a class="btn" href="#/session/${p.id}">Start</a>`}</div>`}
function openModal(html,onclose){const m=$('#modal');m.innerHTML=`<div class="box">${html}</div>`;m.hidden=false;m._close=onclose;const f=m.querySelector('input,button');f&&f.focus()}
function closeModal(){const m=$('#modal');m.hidden=true;m.innerHTML=''}

/* ---------- 10. VIEWS ---------- */
const ROUTES=[['dashboard','Dashboard','◈'],['problems','Problems','☰'],['revision','Revision','↻'],['patterns','Patterns','◇'],['analytics','Analytics','▤'],['interview','Interview','◷'],['settings','Settings','⚙']];
function nextCard(nb,compact){
  if(!nb)return`<div class="empty"><h2>Everything is mastered</h2><p>Run an interview to stress-test your memory.</p></div>`;
  const p=nb.p,rev=isSolved(p.id);
  return`<div class="card next"><div class="sm mu">Next best problem${rev?' — revision':''}</div><h2 style="font-size:1.5rem;margin-top:6px">#${p.lcNumber} ${esc(p.title)}</h2>
  <p><span class="tag">${esc(p.topic)}</span><span class="tag ${dcls(p.difficulty)}">${p.difficulty}</span></p>
  <h3 style="margin-top:12px">Why this problem?</h3><ul class="sm" style="margin:4px 0 14px;padding-left:18px">${nb.reasons.slice(0,4).map(r=>`<li>${esc(r)}</li>`).join('')}</ul>
  <a class="btn pri" href="#/session/${p.id}">Start session</a> <button class="btn" data-act="skip">Show another</button></div>`}
let skipN=0;
function vDashboard(){
  const h=health(),rd=readiness(),lv=level(),rv=revData(),rk=rank(),nb=rk[skipN%Math.max(1,Math.min(rk.length,5))],ts=TOPICS.map(t=>({t:t[0],s:topicStat(t[0])})).sort((a,b)=>b.s.pct-a.s.pct),ms=mission(),sc=solvedCount();
  const strong=ts.filter(x=>x.s.solved).slice(0,2).map(x=>x.t),weak=[...ts].reverse().slice(0,2).map(x=>x.t);
  return`<h1>${sc?'Welcome back.':"Don't just solve problems. Learn how to think."}</h1><p class="mu">Your Personal Intelligence System for DSA.</p>
  <div class="hero" style="margin-top:14px">
   ${nextCard(nb)}
   <div class="card"><button class="btn" data-act="explainH" style="float:right" aria-label="Explain DSA health score">Why?</button><div class="sm mu">DSA health</div><div class="big">${h.score}<small> / 100</small></div>${bar(h.score/100)}
    <p class="sm" style="margin-top:10px"><b class="e">Strong:</b> ${strong.length?esc(strong.join(', ')):'—'}<br><b class="h">Needs work:</b> ${esc(weak.join(', '))}</p></div>
   <div class="card"><button class="btn" data-act="explainR" style="float:right" aria-label="Explain readiness score">Why?</button><div class="sm mu">Interview readiness</div><div class="big">${rd.score}<small>%</small></div>${bar(rd.score/100,'gn')}
    <p class="sm" style="margin-top:10px"><b>Biggest blockers</b><br>${rd.blockers.map((b,i)=>`${i+1}. ${esc(b)}`).join('<br>')}</p></div>
  </div>
  <div class="grid g2">
   <div class="card"><h2>Your DSA coach <span class="tag">DSA Intelligence Engine · local</span></h2>${coach().map(c=>`<div class="ins ${c.t==='warn'?'warn':c.t==='good'?'good':''}"><b>${esc(c.h)}</b>${esc(c.b)}</div>`).join('')}</div>
   <div class="grid">
    <div class="card"><h2>Today's mission</h2>${ms.map(m=>`<div class="row" style="padding:7px 0"><span class="${m.ok?'e':'mu'}" aria-hidden="true">${m.ok?'✔':'○'}</span><span class="t">${esc(m.t)}</span><span class="sm mu">${m.v}</span></div>`).join('')}<p class="sm mu">Level ${lv.l} · ${lv.name} · ${lv.xp} XP${lv.next?` (${lv.next-lv.xp} to next)`:''}</p>${bar(lv.p)}</div>
    <div class="card"><h2>Revision queue</h2><div class="stk"><div><div class="big r" style="font-size:1.8rem;color:var(--rd)">${rv.over.length}</div><div class="sm mu">Overdue</div></div><div><div class="big" style="font-size:1.8rem;color:var(--ye)">${rv.today.length}</div><div class="sm mu">Today</div></div><div><div class="big" style="font-size:1.8rem">${rv.up.length}</div><div class="sm mu">Upcoming</div></div><div><div class="big" style="font-size:1.8rem;color:var(--gn)">${rv.master.length}</div><div class="sm mu">Mastered</div></div></div>${rv.over.length+rv.today.length?`<p><a class="btn" href="#/revision">Open revision</a></p>`:''}</div>
   </div></div>
  <div class="card" style="margin-top:14px"><h2>Activity — last 365 days</h2>${heatmap()}<p class="sm mu">${sc} of 250 solved · ${streak()}-day streak · ${activeDays(30)} active days this month</p></div>
  <div class="card" style="margin-top:14px"><h2>Adaptive roadmap</h2>${roadmap()}</div>`}
function roadmap(){
  const order=TOPICS.map(t=>({t:t[0],s:topicStat(t[0]),i:TOPICS.findIndex(x=>x[0]===t[0])}));
  const pre={'Two Pointers & Sliding Window':'Arrays','Binary Search Tree':'Trees','Graphs':'Trees','Dynamic Programming':'Recursion & Backtracking','Heap / Priority Queue':'Arrays','Trie':'Strings'};
  const open=order.filter(x=>x.s.pct<.7&&(!pre[x.t]||topicStat(pre[x.t]).pct>=.3||x.s.solved>0));
  open.sort((a,b)=>(PRIORITY.includes(b.t)-PRIORITY.includes(a.t))*.5+(a.s.pct-b.s.pct)+(a.i-b.i)*.02);
  const w=[];for(let i=0;i<4&&open.length>i*2;i++)w.push(open.slice(i*2,i*2+2));
  return w.length?`<div class="grid g4">${w.map((g,i)=>`<div><b>Week ${i+1}</b>${g.map(x=>`<div class="sm" style="margin-top:6px">${esc(x.t)}<div class="mu">${x.s.solved}/${x.s.total} solved</div></div>`).join('')}</div>`).join('')}</div><p class="sm mu">Recomputed from your coverage — weak and high-priority topics move earlier; topics unlock when their prerequisites reach 30%.</p>`:'<p>All topics are above 70% coverage. Focus on revision and interviews.</p>'}
function vProblems(){
  return`<h1>Problems</h1><div class="filters"><input id="q" type="search" placeholder="Search: binary, graph, medium, dp, 146, sliding window…" aria-label="Search problems">
  <select id="ft" aria-label="Topic"><option value="">All topics</option>${TOPICS.map(t=>`<option>${esc(t[0])}</option>`).join('')}</select>
  <select id="fd" aria-label="Difficulty"><option value="">Any difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
  <select id="fs" aria-label="Status"><option value="">Any status</option><option value="todo">Not started</option><option value="attempted">Attempted</option><option value="solved">Solved</option><option value="due">Due for revision</option></select>
  <select id="so" aria-label="Sort"><option value="">PDF order</option><option value="n">LeetCode number</option><option value="d">Difficulty</option><option value="m">Memory strength</option></select></div>
  <div class="chips" style="margin-bottom:10px"><button class="chip" data-rand="any">Random</button><button class="chip" data-rand="Medium">Random Medium</button><button class="chip" data-rand="Hard">Random Hard</button><button class="chip" data-rand="weak">Random weak topic</button><button class="chip" data-rand="pattern">Random pattern</button><button class="chip" data-rand="rev">Random revision</button></div>
  <div class="card" id="plist"></div>`}
let plimit=50;
function renderList(){const q=$('#q').value,t=$('#ft').value,d=$('#fd').value,s=$('#fs').value,so=$('#so').value;
  let l=search(q).filter(p=>(!t||p.topic===t)&&(!d||p.difficulty===d)&&(!s||(s==='due'?(rec(p.id).st==='solved'&&rec(p.id).due<=today()):(rec(p.id).st||'todo')===s)));
  if(so==='n')l=[...l].sort((a,b)=>a.lcNumber-b.lcNumber);if(so==='d')l=[...l].sort((a,b)=>['Easy','Medium','Hard'].indexOf(a.difficulty)-['Easy','Medium','Hard'].indexOf(b.difficulty));if(so==='m')l=[...l].sort((a,b)=>mem(a.id)-mem(b.id));
  $('#plist').innerHTML=l.length?l.slice(0,plimit).map(p=>probRow(p)).join('')+(l.length>plimit?`<p style="text-align:center"><button class="btn" data-act="more">Show more (${l.length-plimit} left)</button></p>`:'')+`<p class="sm mu">${l.length} of 250 problems</p>`:`<div class="empty"><h2>No problem matches that</h2><p>Try a topic (graph), a pattern (sliding window), a number (146) or a level (medium).</p></div>`}
function vSession(id){
  const p=PROBLEMS[id-1];if(!p)return`<div class="empty"><h2>Problem not found</h2><a class="btn" href="#/problems">Browse problems</a></div>`;
  if(!S.sess||S.sess.id!==id){S.sess={id,start:Date.now(),hints:0,hintAt:null};save()}
  const r=rec(id),j=r.j||{},ss=S.sess,pt=p.patterns[0];
  const revealed=ss.hints>=2||r.st==='solved';
  return`<p><a href="#/problems">← Problems</a></p><div class="grid g2" style="margin-top:8px">
  <div><div class="card"><h1>#${p.lcNumber} ${esc(p.title)}</h1><p><span class="tag">${esc(p.topic)}</span><span class="tag ${dcls(p.difficulty)}">${p.difficulty}</span><span class="tag" id="patTag">${revealed?'Pattern: '+esc(p.patterns.join(' / ')):'Pattern: hidden until you need it'}</span></p>
   <div class="timer" id="tm" aria-live="off">00:00</div><p><a class="btn pri" href="${p.url}" target="_blank" rel="noopener">Open LeetCode ↗</a></p></div>
   <div class="card" style="margin-top:14px"><h2>Thinking journal</h2>
    <label class="sm mu" for="j1">1. What is my initial approach?</label><textarea id="j1" data-j="approach">${esc(j.approach)}</textarea>
    <label class="sm mu" for="j2">2. Which data structure will I use?</label><input id="j2" data-j="ds" value="${esc(j.ds)}">
    <label class="sm mu" for="j3">3. Expected complexity?</label><input id="j3" data-j="cx" value="${esc(j.cx)}"></div></div>
  <div><div class="card"><h2>Hints — you control the reveal</h2><div id="hints">${[0,1,2].map(i=>i<ss.hints?`<div class="ins"><b>Hint ${i+1}</b>${esc(PAT[pt][i])}</div>`:'').join('')}${ss.hints>=4?`<div class="ins"><b>Approach outline</b>${esc(PAT[pt][3])} Expected: ${esc(PAT[pt][4])}.</div>`:''}</div>
    <button class="btn" data-act="hint" ${ss.hints>=4?'disabled':''}>${ss.hints>=3?'Reveal approach outline':'Reveal hint '+(ss.hints+1)}</button>
    <p class="sm mu">Hints used: ${ss.hints}${ss.hintAt!=null?` · first hint after ${ss.hintAt} min`:''}. Read → think → hint → stronger hint → approach. Full solutions are never shown.</p>
    <div class="chips"><button class="chip" data-tutor="s">Socratic</button><button class="chip" data-tutor="e">Explain</button><button class="chip" data-tutor="c">Complexity</button><button class="chip" data-tutor="d">Debug my thinking</button></div><div id="tutor" class="sm" style="margin-top:8px" aria-live="polite"></div></div>
   <div class="card" style="margin-top:14px"><h2>When you finish</h2>
    <p class="sm mu">Confidence</p><div class="chips" id="conf" role="radiogroup" aria-label="Confidence">${[1,2,3,4,5].map(n=>`<button class="chip" role="radio" aria-pressed="${(r.conf||0)===n}" aria-checked="${(r.conf||0)===n}" data-conf="${n}">${n}</button>`).join('')}</div>
    <p class="sm mu" style="margin-top:10px">What went wrong? (pick any)</p><div class="chips" id="mist">${MISTAKES.map(m=>`<button class="chip" aria-pressed="false" data-m="${esc(m)}">${esc(m)}</button>`).join('')}</div>
    <label class="sm mu" for="j4">Key insight</label><textarea id="j4" data-j="insight">${esc(j.insight)}</textarea>
    <label class="sm mu" for="j5">What would I do differently?</label><input id="j5" data-j="diff" value="${esc(j.diff)}">
    <div class="sticky-act"><button class="btn ok" data-act="solved">Solved</button> <button class="btn no" data-act="unsolved">Not solved yet</button></div></div></div></div>`}
function tutor(mode,p){const pt=p.patterns[0],r=rec(p.id),j=r.j||{};
  if(mode==='s')return PAT[pt].slice(0,3).map(q=>'• '+q).join('\n');
  if(mode==='e')return`${pt}: ${PAT[pt][3]}`;
  if(mode==='c')return`Typical for ${pt}: ${PAT[pt][4]}.${j.cx?` You wrote "${j.cx}" — does it hold under the constraints?`:' Write your own estimate in the journal first.'}`;
  const fb=[];if(!j.approach)fb.push('Write your approach in the journal first so there is something to critique.');else{
    if(!(j.approach||'').toLowerCase().includes(pt.split(' ')[0].toLowerCase())&&!(j.ds||'').toLowerCase().includes(pt.split(' ')[0].toLowerCase()))fb.push('Your approach never mentions the data structure or technique this problem family relies on. Ask: '+PAT[pt][0]);
    if(!j.cx)fb.push('You have not stated complexity. What is the bottleneck of your approach?');else fb.push('Check your stated complexity ('+j.cx+') against the usual target: '+PAT[pt][4]+'.');
    if(j.approach.length<40)fb.push('Your approach is very short. Add the steps and one edge case.')}
  return fb.join('\n')}
function memoryCard(p){const r=rec(p.id),j=r.j||{},pt=p.patterns[0],last=(r.att||[]).slice(-1)[0]||{};
  return`<h2>Memory card</h2><p><b>#${p.lcNumber} ${esc(p.title)}</b></p><p class="sm"><b>Pattern:</b> ${esc(p.patterns.join(' / '))}</p><p class="sm"><b>Core idea:</b> ${esc(j.insight||PAT[pt][3])}</p><p class="sm"><b>Trigger:</b> ${esc(PAT[pt][0])}</p><p class="sm"><b>Common trap:</b> ${esc((last.mist&&last.mist[0])?mistakeTip(last.mist[0]):(j.diff||'Check edge cases: empty, one element, duplicates.'))}</p><p class="sm"><b>Complexity:</b> ${esc(j.cx||PAT[pt][4])}</p><p class="sm"><b>Review:</b> in ${Math.max(1,-ago(r.due))} day(s)</p><p><button class="btn pri" data-act="close">Done</button> <a class="btn" href="#/dashboard">Next recommendation</a></p>`}
function finish(ok){const ss=S.sess;if(!ss)return;const p=PROBLEMS[ss.id-1],r=ens(ss.id),min=Math.round((Date.now()-ss.start)/6000)/10,
  mist=[...document.querySelectorAll('#mist [aria-pressed=true]')].map(b=>b.dataset.m);
  r.att.push({d:today(),min,ok,mist,hints:ss.hints,hintAt:ss.hintAt});
  const first=r.st!=='solved',cb=$('#conf [aria-pressed=true]');if(cb)r.conf=+cb.dataset.conf;else if(!r.conf)r.conf=ok?(ss.hints?2:3):1;
  if(ok){r.st='solved';r.last=today();if(first){r.iv=0;S.xp+=XPD[p.difficulty]}schedule(r);const d=S.days[today()]||{};
    logDay(first?1:0,min,0);const wp=mission().find(m=>m.pt);if(wp&&p.patterns.includes(wp.pt))S.days[today()].wp=1}
  else{if(r.st!=='solved')r.st='attempted';logDay(0,min,0)}
  const m=mission();if(m.every(x=>x.ok)&&!S.days[today()].bonus){S.days[today()].bonus=1;S.xp+=15;toast('Daily mission complete +15 XP')}
  S.sess=null;save();
  if(ok){openModal(memoryCard(p))}else{toast('Logged. The engine will bring this one back.');location.hash='#/dashboard'}}
function vRevision(){const rv=revData();const q=[...rv.over.map(p=>[p,'Overdue']),...rv.today.map(p=>[p,'Due today'])];
  return`<h1>Revision</h1><div class="grid g4"><div class="card"><div class="big" style="color:var(--rd)">${rv.over.length}</div>Overdue</div><div class="card"><div class="big" style="color:var(--ye)">${rv.today.length}</div>Today</div><div class="card"><div class="big">${rv.up.length}</div>Upcoming</div><div class="card"><div class="big" style="color:var(--gn)">${rv.master.length}</div>Mastered</div></div>
  <div class="card" style="margin-top:14px">${q.length?q.map(([p,l])=>{const r=rec(p.id);return`<div class="row"><span class="num">#${p.lcNumber}</span><div class="t"><a href="${p.url}" target="_blank" rel="noopener">${esc(p.title)} ↗</a><div class="sm mu">${l} · confidence ${r.conf}/5 · last solved ${ago(r.last)}d ago</div><div class="brow" style="grid-template-columns:90px 1fr 40px"><span class="sm">Memory</span>${bar(mem(p.id)/100)}<span>${mem(p.id)}%</span></div></div><button class="btn ok" data-rev="${p.id}:1">Remembered</button><button class="btn no" data-rev="${p.id}:0">Forgot</button></div>`}).join(''):`<div class="empty"><h2>Nothing due — your memory is current</h2><p>Solved problems appear here on a schedule tuned to your confidence. Solve one today to start the loop.</p><a class="btn pri" href="#/dashboard">See next problem</a></div>`}</div>
  ${rv.up.length?`<div class="card" style="margin-top:14px"><h2>Upcoming</h2>${rv.up.slice(0,12).map(p=>`<div class="row"><span class="num">#${p.lcNumber}</span><span class="t">${esc(p.title)}</span><span class="sm mu">in ${-ago(rec(p.id).due)}d · memory ${mem(p.id)}%</span></div>`).join('')}</div>`:''}`}
function vPatterns(){const ps=ALL_PATTERNS.map(patStat).sort((a,b)=>b.mastery-a.mastery),g=(l,u)=>ps.filter(p=>p.mastery>=l&&p.mastery<u);
  const grp=(t,l)=>l.length?`<p class="sm mu" style="margin-top:12px">${t}</p>${l.map(p=>brow(p.pt,p.mastery,pct(p.mastery)+'%')).join('')}`:'';
  return`<h1>Pattern mastery</h1><p class="mu">Mastery = average memory strength across every problem that uses the pattern (unsolved counts as zero).</p><div class="card">${grp('Strong (60%+)',g(.6,2))}${grp('Emerging (25–60%)',g(.25,.6))}${grp('Weak / untouched',g(0,.25))}</div>
  <h2 style="margin-top:18px">Topics (PDF classification)</h2><div class="card">${TOPICS.map(t=>{const s=topicStat(t[0]);return brow(t[0],s.pct,`${s.solved}/${s.total}`)}).join('')}</div>`}
function vAnalytics(){const lv=level(),sc=solvedCount(),at=attempts(),w=weekly(8),mx=Math.max(1,...w),tm=at.map(a=>a.min).filter(x=>x>0),rs=revSuccess(),ms=mistakeStats(),rv=revData();
  const tile=(l,v)=>`<div class="card"><div class="big" style="font-size:2rem">${v}</div><div class="sm mu">${l}</div></div>`;
  return`<h1>Analytics</h1><div class="grid g4">${tile('Solved',sc+' / 250')}${tile('Remaining',250-sc)}${tile('Completion',pct(sc/250)+'%')}${tile('Level '+lv.l+' · '+lv.name,lv.xp+' XP')}</div>
  <div class="grid g2" style="margin-top:14px"><div class="card"><h2>Difficulty</h2>${['Easy','Medium','Hard'].map(d=>{const s=diffStat(d);return brow(d,s.solved/s.total,`${s.solved}/${s.total}`)+`<p class="sm mu" style="margin:0">Success ${s.att?pct(s.success)+'%':'—'} · avg ${s.att?Math.round(s.avgMin)+' min':'—'}</p>`}).join('')}</div>
  <div class="card"><h2>Time</h2><p>Average solve time: <b>${tm.length?Math.round(avg(tm))+' min':'—'}</b><br>Fastest: <b>${tm.length?Math.min(...tm)+' min':'—'}</b> · Slowest: <b>${tm.length?Math.max(...tm)+' min':'—'}</b><br>Streak: <b>${streak()} days</b></p><p class="sm mu">Problems solved per week (8 weeks)</p><div class="vbars">${w.map(x=>`<div><i style="height:${x/mx*70}px"></i>${x}</div>`).join('')}</div></div>
  <div class="card"><h2>Mistake intelligence</h2>${ms.length?ms.map(m=>brow(m.k,m.p)).join('')+`<div class="ins"><b>Targeted practice</b>${esc(mistakeTip(ms[0].k))}</div>`:'<div class="empty"><h2>No mistakes logged yet</h2><p>Mark what went wrong after an attempt and your recurring failure modes appear here.</p></div>'}</div>
  <div class="card"><h2>Revision</h2><p>Success rate: <b>${rs.rate==null?'—':pct(rs.rate)+'%'}</b> (${rs.ok}/${rs.n})<br>Overdue: <b>${rv.over.length}</b> · Mastered: <b>${rv.master.length}</b><br>Retention (avg memory strength of solved): <b>${sc?Math.round(avg(PROBLEMS.filter(p=>isSolved(p.id)).map(p=>mem(p.id)))):0}%</b></p></div></div>
  <div class="card" style="margin-top:14px"><h2>Topics</h2>${TOPICS.map(t=>{const s=topicStat(t[0]);return`<div class="brow" style="grid-template-columns:150px 1fr 150px"><span>${esc(t[0])}</span>${bar(s.pct)}<span class="sm">${s.solved}/${s.total} · conf ${s.conf?s.conf.toFixed(1):'—'} · ${s.avgMin?Math.round(s.avgMin)+'m':'—'}</span></div>`}).join('')}</div>`}
/* interview */
const PRESETS={'General MNC':{t:['Arrays','Strings','Trees','Graphs','Dynamic Programming'],d:{Easy:1,Medium:2,Hard:.5}},'TCS':{t:['Arrays','Strings','Linked List','Stack & Queue','Binary Search'],d:{Easy:3,Medium:1,Hard:0}},'Infosys':{t:['Arrays','Strings','Two Pointers & Sliding Window','Linked List'],d:{Easy:3,Medium:1,Hard:0}},'Wipro':{t:['Arrays','Strings','Stack & Queue','Binary Search'],d:{Easy:3,Medium:1,Hard:0}},'Accenture':{t:['Arrays','Strings','Linked List','Matrix','Greedy'],d:{Easy:2,Medium:2,Hard:0}},'Cognizant':{t:['Arrays','Strings','Two Pointers & Sliding Window','Trees'],d:{Easy:2,Medium:2,Hard:0}},'Product-based':{t:['Arrays','Trees','Graphs','Dynamic Programming','Heap / Priority Queue','Design'],d:{Easy:0,Medium:2,Hard:2}},'Mixed (weak topics)':{t:null,d:{Easy:1,Medium:2,Hard:1}}};
function vInterview(){const iv=S.iv;
  if(!iv)return`<h1>Interview simulator</h1><p class="mu">Timed, no solutions. Presets are practice configurations, not official company question banks.</p><div class="grid g2"><div class="card"><label class="sm mu" for="iD">Duration</label><select id="iD">${[30,45,60,90,120].map(m=>`<option value="${m}" ${m===60?'selected':''}>${m} minutes</option>`).join('')}</select>
  <label class="sm mu" for="iP">Company simulator</label><select id="iP">${Object.keys(PRESETS).map(k=>`<option>${esc(k)}</option>`).join('')}</select>
  <p><label><input type="checkbox" id="iB" style="width:auto"> Blind mode — hide topic, pattern and difficulty</label></p><p><button class="btn pri" data-act="startIv">Start interview</button></p></div>
  <div class="card"><h2>Previous interviews</h2>${S.ints.length?S.ints.slice(-6).reverse().map(i=>`<div class="row"><span class="t">${esc(i.d)} · ${i.dur} min${i.blind?' · blind':''} · ${esc(i.preset)}</span><b>${i.score}/100</b></div>`).join(''):'<div class="empty"><h2>Your first interview is waiting</h2><p>Pick a duration and a preset. Problems are chosen from your weak spots.</p></div>'}</div></div>`;
  return`<div class="card"><div class="sm mu">${esc(iv.preset)}${iv.blind?' · blind':''}</div><div class="timer" id="ivT">--:--</div></div>
  ${iv.ids.map((id,i)=>{const p=PROBLEMS[id-1];return`<div class="card" style="margin-top:12px"><h2>Problem ${i+1}: #${p.lcNumber} ${esc(p.title)}</h2>${iv.blind?'':`<p><span class="tag">${esc(p.topic)}</span><span class="tag ${dcls(p.difficulty)}">${p.difficulty}</span></p>`}
   <a class="btn" href="${p.url}" target="_blank" rel="noopener">Open LeetCode ↗</a>
   ${iv.blind?`<label class="sm mu" for="g${i}">Which pattern is this?</label><select id="g${i}" data-g="${id}"><option value="">Choose…</option>${ALL_PATTERNS.map(x=>`<option ${iv.guess[id]===x?'selected':''}>${x}</option>`).join('')}</select>`:''}
   <label class="sm mu" for="n${i}">Thinking journal</label><textarea id="n${i}" data-ivj="${id}">${esc(iv.jr[id]||'')}</textarea>
   <label><input type="checkbox" style="width:auto" data-sol="${id}" ${iv.sol[id]?'checked':''}> I solved it</label></div>`}).join('')}
  <p class="sticky-act"><button class="btn pri" data-act="endIv">Finish interview</button> <button class="btn" data-act="abortIv">Abort</button></p>`}
function startInterview(){const dur=+$('#iD').value,pn=$('#iP').value,pr=PRESETS[pn],blind=$('#iB').checked,n={30:1,45:2,60:2,90:3,120:4}[dur];
  const tc={},pc={};TOPICS.forEach(t=>tc[t[0]]=topicStat(t[0]));ALL_PATTERNS.forEach(x=>pc[x]=patStat(x));
  let c=PROBLEMS.filter(p=>(!pr.t||pr.t.includes(p.topic))&&pr.d[p.difficulty]>0).map(p=>{const s=scoreProblem({...p},tc,pc)||{s:0};const r=rec(p.id);
    let v=r.st==='solved'?(mem(p.id)<60?25:0):(s.s||0)+20;return{p,v:v*pr.d[p.difficulty]+Math.random()*30}}).sort((a,b)=>b.v-a.v);
  const ids=[],used=new Set();c.forEach(x=>{if(ids.length<n&&!used.has(x.p.topic)){used.add(x.p.topic);ids.push(x.p.id)}});c.forEach(x=>{if(ids.length<n&&!ids.includes(x.p.id))ids.push(x.p.id)});
  S.iv={start:Date.now(),dur,ids,blind,preset:pn,sol:{},guess:{},jr:{}};save();render()}
function endInterview(){const iv=S.iv;if(!iv)return;const n=iv.ids.length,sol=iv.ids.filter(id=>iv.sol[id]).length,used=(Date.now()-iv.start)/60000,left=Math.max(0,1-used/iv.dur);
  const solving=sol/n*100,time=sol===n?60+40*left:sol/n*60,cons=health().parts[1].v*100;
  let pat;if(iv.blind)pat=iv.ids.filter(id=>PROBLEMS[id-1].patterns.includes(iv.guess[id])).length/n*100;else pat=avg(iv.ids.map(id=>avg(PROBLEMS[id-1].patterns.map(x=>patStat(x).mastery))))*100;
  const parts={'Problem solving':solving,'Time management':time,'Consistency':cons,'Pattern recognition':pat},score=Math.round(.45*solving+.2*time+.15*cons+.2*pat);
  iv.ids.forEach(id=>{if(iv.sol[id]){const r=ens(id),first=r.st!=='solved';r.st='solved';r.last=today();if(first){r.iv=0;r.conf=r.conf||3;S.xp+=XPD[PROBLEMS[id-1].difficulty]}r.att.push({d:today(),min:Math.round(used/n),ok:true,mist:[],hints:0});schedule(r)}else{const r=ens(id);if(r.st!=='solved')r.st='attempted';r.att.push({d:today(),min:Math.round(used/n),ok:false,mist:[],hints:0})}});
  S.ints.push({d:today(),dur:iv.dur,blind:iv.blind,preset:iv.preset,score,parts});S.xp+=30;logDay(sol,Math.round(used),0);S.iv=null;save();
  const low=Object.entries(parts).sort((a,b)=>a[1]-b[1])[0];
  const rec_={'Problem solving':'Revisit the unsolved problems with the hint ladder, then re-attempt them in 3 days.','Time management':'Set a 25-minute checkpoint per problem; if there is no approach by then, move on.','Consistency':'Aim for a short session every day this week.','Pattern recognition':'Use blind mode again and say the pattern out loud before coding.'}[low[0]];
  openModal(`<h2>Interview score</h2><div class="big">${score}<small> / 100</small></div>${Object.entries(parts).map(([k,v])=>brow(k,v/100,Math.round(v))).join('')}<div class="ins"><b>Recommendation</b>Weakest area: ${low[0]}. ${esc(rec_)}</div><p><button class="btn pri" data-act="close">Close</button></p>`,()=>{location.hash='#/dashboard'})}
function vSettings(){const w=validate();
  return`<h1>Settings</h1><div class="grid g2"><div class="card"><h2>Status</h2><p>AI provider: <b>not configured</b> — this build uses the local DSA Intelligence Engine only.<br>Core intelligence: <b class="e">online</b><br>Local data: <b class="e">available</b> (${Object.keys(S.p).length} problem records)</p>
  <p class="sm mu">Dataset check: ${w.length?`<b class="h">${w.map(esc).join('; ')}</b>`:'<b class="e">250 problems · 17 topics · all counts match the PDF</b>'}</p></div>
  <div class="card"><h2>Your data</h2><p class="sm mu">Everything is stored in this browser's LocalStorage. Nothing is uploaded.</p><button class="btn" data-act="export">Export progress</button> <label class="btn">Import<input type="file" id="imp" accept="application/json" hidden></label> <button class="btn no" data-act="reset">Reset all</button></div>
  <div class="card"><h2>Appearance</h2><button class="btn" data-act="theme">Toggle theme (T)</button></div>
  <div class="card"><h2>Keyboard</h2><p class="sm">Ctrl+K palette · / search · N next problem · R revision · I interview · F focus session · A analytics · T theme · Esc close</p></div></div>`}
/* ---------- router ---------- */
let timers=[];
function render(){timers.forEach(clearInterval);timers=[];const h=(location.hash||'#/dashboard').slice(2).split('/'),v=h[0]||'dashboard',app=$('#app');
  const views={dashboard:vDashboard,problems:vProblems,revision:vRevision,patterns:vPatterns,analytics:vAnalytics,interview:vInterview,settings:vSettings};
  app.innerHTML=v==='session'?vSession(+h[1]):(views[v]||vDashboard)();
  const cur=v==='session'?'problems':v;
  $('#nav').innerHTML=ROUTES.map(r=>`<a href="#/${r[0]}" ${r[0]===cur?'aria-current="page"':''}>${r[1]}</a>`).join('');
  $('#bnav').innerHTML=ROUTES.filter(r=>r[0]!=='patterns'&&r[0]!=='settings').map(r=>`<a href="#/${r[0]}" ${r[0]===cur?'aria-current="page"':''}><b aria-hidden="true">${r[2]}</b>${r[1]}</a>`).join('');
  $('#streakPill').textContent=streak()?'🔥 '+streak():'';document.documentElement.dataset.theme=S.theme;window.scrollTo(0,0);
  if(v==='problems'){plimit=50;renderList();$('#q').addEventListener('input',debounce(()=>{plimit=50;renderList()},150));['#ft','#fd','#fs','#so'].forEach(s=>$(s).addEventListener('change',()=>{plimit=50;renderList()}))}
  if(v==='session'&&S.sess){const t=()=>{const e=$('#tm');if(e)e.textContent=mmss((Date.now()-S.sess.start)/1000)};t();timers.push(setInterval(t,1000))}
  if(v==='interview'&&S.iv){const t=()=>{const e=$('#ivT');if(!e||!S.iv)return;const l=S.iv.dur*60-(Date.now()-S.iv.start)/1000;e.textContent=mmss(l);if(l<=0){endInterview()}};t();timers.push(setInterval(t,1000))}
  if(v==='settings'){const f=$('#imp');f&&f.addEventListener('change',e=>{const fl=e.target.files[0];if(!fl)return;const rd=new FileReader();rd.onload=()=>{try{const d=JSON.parse(rd.result);if(!d.p||!d.days)throw 0;S=d;save();toast('Progress imported');render()}catch(x){toast('That file is not a DSA OS export')}};rd.readAsText(fl)})}}
/* ---------- command palette ---------- */
function randomPick(kind){let l=PROBLEMS.filter(p=>!isSolved(p.id));
  if(kind==='Medium'||kind==='Hard')l=l.filter(p=>p.difficulty===kind);
  if(kind==='weak'){const w=TOPICS.map(t=>({t:t[0],s:topicStat(t[0])})).sort((a,b)=>a.s.pct-b.s.pct).slice(0,3).map(x=>x.t);l=l.filter(p=>w.includes(p.topic))}
  if(kind==='pattern'){const pt=pick(ALL_PATTERNS);l=l.filter(p=>p.patterns.includes(pt));toast('Pattern: '+pt)}
  if(kind==='rev'){const d=revData();l=[...d.over,...d.today]}
  if(!l.length)return toast('Nothing matches — try another random mode');location.hash='#/session/'+pick(l).id}
const nbId=()=>{const n=nextBest();return n?n.p.id:1};
const CMDS=[['Search problems','/',()=>{location.hash='#/problems';setTimeout(()=>{const q=$('#q');q&&q.focus()},50)}],['Start next best problem','N',()=>location.hash='#/session/'+nbId()],['Start daily mission','',()=>location.hash='#/session/'+nbId()],['Start interview','I',()=>location.hash='#/interview'],['Start focus session','F',()=>location.hash='#/session/'+nbId()],['Open revision','R',()=>location.hash='#/revision'],['Random problem','',()=>randomPick('any')],['Toggle theme','T',toggleTheme],['Open analytics','A',()=>location.hash='#/analytics'],['Open patterns','',()=>location.hash='#/patterns'],['Export progress','',exportData]];
function toggleTheme(){S.theme=S.theme==='dark'?'light':'dark';save();document.documentElement.dataset.theme=S.theme}
function exportData(){const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='dsa-os-progress-'+today()+'.json';a.click();toast('Exported')}
let palSel=0,palItems=[];
function palette(){openModal(`<div class="cmd"><input id="pq" placeholder="Type a command or problem…" aria-label="Command palette"><ul id="pl" role="listbox"></ul></div>`);palSel=0;palRender('');$('#pq').addEventListener('input',e=>{palSel=0;palRender(e.target.value)})}
function palRender(q){const ql=q.toLowerCase();palItems=CMDS.filter(c=>c[0].toLowerCase().includes(ql)||!q).map(c=>({l:c[0],k:c[1],f:c[2]}));
  if(q)search(q).slice(0,6).forEach(p=>palItems.push({l:`#${p.lcNumber} ${p.title}`,k:p.topic,f:()=>location.hash='#/session/'+p.id}));
  $('#pl').innerHTML=palItems.map((c,i)=>`<li role="option" class="${i===palSel?'sel':''}" data-i="${i}"><span>${esc(c.l)}</span><kbd>${esc(c.k)}</kbd></li>`).join('')||'<li>No match</li>'}
/* ---------- 11. EVENTS ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-act],[data-rev],[data-conf],[data-m],[data-tutor],[data-rand],li[data-i]'),m=$('#modal');
  if(e.target===m){closeModal();m._close&&m._close();return}if(!t)return;const a=t.dataset.act;
  if(t.dataset.i!==undefined){const it=palItems[+t.dataset.i];closeModal();it&&it.f();return}
  if(t.dataset.rev){const[i,o]=t.dataset.rev.split(':');revise(+i,o==='1');render();return}
  if(t.dataset.conf){document.querySelectorAll('#conf .chip').forEach(b=>{const on=b===t;b.setAttribute('aria-pressed',on);b.setAttribute('aria-checked',on)});return}
  if(t.dataset.m){t.setAttribute('aria-pressed',t.getAttribute('aria-pressed')!=='true');return}
  if(t.dataset.rand){randomPick(t.dataset.rand);return}
  if(t.dataset.tutor){const p=PROBLEMS[S.sess.id-1];$('#tutor').innerText=tutor(t.dataset.tutor,p)||'Nothing to analyse yet.';return}
  const f={skip:()=>{skipN++;render()},more:()=>{plimit+=50;renderList()},
   hint:()=>{const s=S.sess;if(s.hints===0)s.hintAt=Math.round((Date.now()-s.start)/6000)/10;s.hints=s.hints>=3?4:s.hints+1;save();const y=window.scrollY;render();window.scrollTo(0,y)},
   solved:()=>finish(true),unsolved:()=>finish(false),close:()=>{const c=m._close;closeModal();if(c)c();else location.hash='#/dashboard'},
   startIv,endIv:endInterview,abortIv:()=>{S.iv=null;save();render()},export:exportData,theme:toggleTheme,
   reset:()=>{if(confirm('Delete ALL progress? Export first if unsure.')){localStorage.removeItem(KEY);S=load();render()}},
   explainH:()=>{const h=health();openModal(`<h2>DSA health: ${h.score}/100</h2><p class="sm mu">A weighted sum of seven measured components.</p>${h.parts.map(p=>brow(p.n+' (×'+p.w+')',p.v,Math.round(p.v*p.w)+'/'+p.w)+`<p class="sm mu" style="margin:0">${esc(p.d)}</p>`).join('')}<p><button class="btn" data-act="close">Close</button></p>`)},
   explainR:()=>{const r=readiness();openModal(`<h2>Interview readiness: ${r.score}%</h2>${r.parts.map(p=>brow(p.n+' (×'+p.w+')',p.v,Math.round(p.v*p.w)+'/'+p.w)).join('')}<p><button class="btn" data-act="close">Close</button></p>`)}}[a];f&&f()});
document.addEventListener('input',e=>{const t=e.target;
  if(t.dataset.j&&S.sess){const r=ens(S.sess.id);r.j[t.dataset.j]=t.value;save()}
  if(t.dataset.ivj&&S.iv){S.iv.jr[t.dataset.ivj]=t.value;save()}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.sol&&S.iv){S.iv.sol[t.dataset.sol]=t.checked;save()}if(t.dataset.g&&S.iv){S.iv.guess[t.dataset.g]=t.value;save()}});
document.addEventListener('keydown',e=>{const m=$('#modal'),typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette();return}
  if(e.key==='Escape'){if(!m.hidden){const c=m._close;closeModal();c&&c()}return}
  if(!m.hidden&&$('#pl')){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();palSel=(palSel+(e.key==='ArrowDown'?1:-1)+palItems.length)%palItems.length;palRender($('#pq').value)}
    if(e.key==='Enter'){const it=palItems[palSel];closeModal();it&&it.f()}return}
  if(typing||e.ctrlKey||e.metaKey||e.altKey||!m.hidden)return;
  const k=e.key.toLowerCase(),map={'/':0,n:1,r:5,i:3,f:4,a:8,t:7};if(k in map){e.preventDefault();CMDS[map[k]][2]()}});
$('#kBtn')&&0;

/* ---------- 12. INIT ---------- */
if(typeof document!=='undefined'){
  const w=validate();if(w.length)console.warn('DSA OS data warning:',w);
  document.documentElement.dataset.theme=S.theme;
  $('#kBtn').addEventListener('click',palette);
  window.addEventListener('hashchange',render);render();
}
if(typeof module!=='undefined')module.exports={PROBLEMS,validate,TOPICS};
