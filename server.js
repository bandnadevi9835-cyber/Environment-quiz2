const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const QUESTIONS = [
  {cat:'🔬 Science',q:'What is the chemical symbol for gold?',opts:{A:'Au',B:'Ag',C:'Fe',D:'Cu'},ans:'A'},
  {cat:'🔬 Science',q:'How many bones are in the adult human body?',opts:{A:'196',B:'206',C:'216',D:'226'},ans:'B'},
  {cat:'🔬 Science',q:'What planet is known as the Red Planet?',opts:{A:'Venus',B:'Jupiter',C:'Mars',D:'Saturn'},ans:'C'},
  {cat:'🔬 Science',q:'What is the speed of light (approx.) in km/s?',opts:{A:'200,000',B:'250,000',C:'300,000',D:'350,000'},ans:'C'},
  {cat:'🔬 Science',q:'What gas do plants absorb from the atmosphere?',opts:{A:'Oxygen',B:'Nitrogen',C:'Carbon Dioxide',D:'Hydrogen'},ans:'C'},
  {cat:'🔬 Science',q:'What is the powerhouse of the cell?',opts:{A:'Nucleus',B:'Ribosome',C:'Mitochondria',D:'Golgi body'},ans:'C'},
  {cat:'🔬 Science',q:'What element has the atomic number 1?',opts:{A:'Helium',B:'Oxygen',C:'Carbon',D:'Hydrogen'},ans:'D'},
  {cat:'🔬 Science',q:'Which planet has the most moons?',opts:{A:'Jupiter',B:'Saturn',C:'Uranus',D:'Neptune'},ans:'B'},
  {cat:'🔬 Science',q:'What is the hardest natural substance on Earth?',opts:{A:'Gold',B:'Iron',C:'Diamond',D:'Quartz'},ans:'C'},
  {cat:'🔬 Science',q:'What is the boiling point of water at sea level (°C)?',opts:{A:'90',B:'95',C:'100',D:'105'},ans:'C'},
  {cat:'🌍 Geography',q:'What is the capital of Australia?',opts:{A:'Sydney',B:'Melbourne',C:'Brisbane',D:'Canberra'},ans:'D'},
  {cat:'🌍 Geography',q:'Which is the longest river in the world?',opts:{A:'Amazon',B:'Nile',C:'Yangtze',D:'Mississippi'},ans:'B'},
  {cat:'🌍 Geography',q:'Which country has the largest population?',opts:{A:'India',B:'USA',C:'China',D:'Indonesia'},ans:'A'},
  {cat:'🌍 Geography',q:'What is the smallest country in the world?',opts:{A:'Monaco',B:'San Marino',C:'Liechtenstein',D:'Vatican City'},ans:'D'},
  {cat:'🌍 Geography',q:'Which ocean is the largest?',opts:{A:'Atlantic',B:'Indian',C:'Pacific',D:'Arctic'},ans:'C'},
  {cat:'🌍 Geography',q:'In which continent is the Sahara Desert located?',opts:{A:'Asia',B:'Africa',C:'South America',D:'Australia'},ans:'B'},
  {cat:'🌍 Geography',q:'What is the capital of Canada?',opts:{A:'Toronto',B:'Vancouver',C:'Ottawa',D:'Montreal'},ans:'C'},
  {cat:'🌍 Geography',q:'Which mountain is the tallest in the world?',opts:{A:'K2',B:'Kangchenjunga',C:'Mont Blanc',D:'Mount Everest'},ans:'D'},
  {cat:'🌍 Geography',q:'How many continents are on Earth?',opts:{A:'5',B:'6',C:'7',D:'8'},ans:'C'},
  {cat:'🌍 Geography',q:'Which country is home to the Amazon Rainforest primarily?',opts:{A:'Colombia',B:'Peru',C:'Bolivia',D:'Brazil'},ans:'D'},
  {cat:'📜 History',q:'In what year did World War II end?',opts:{A:'1943',B:'1944',C:'1945',D:'1946'},ans:'C'},
  {cat:'📜 History',q:'Who was the first President of the United States?',opts:{A:'John Adams',B:'Thomas Jefferson',C:'George Washington',D:'Benjamin Franklin'},ans:'C'},
  {cat:'📜 History',q:'In which year did the Berlin Wall fall?',opts:{A:'1987',B:'1988',C:'1989',D:'1990'},ans:'C'},
  {cat:'📜 History',q:'Who painted the Mona Lisa?',opts:{A:'Michelangelo',B:'Raphael',C:'Leonardo da Vinci',D:'Donatello'},ans:'C'},
  {cat:'📜 History',q:'Which ancient wonder was located in Alexandria?',opts:{A:'Hanging Gardens',B:'The Lighthouse',C:'The Colossus',D:'Temple of Artemis'},ans:'B'},
  {cat:'📜 History',q:'In what year did man first land on the Moon?',opts:{A:'1965',B:'1967',C:'1969',D:'1971'},ans:'C'},
  {cat:'📜 History',q:'Who was the first woman to win a Nobel Prize?',opts:{A:'Rosalind Franklin',B:'Marie Curie',C:'Ada Lovelace',D:'Dorothy Hodgkin'},ans:'B'},
  {cat:'📜 History',q:'Which empire was ruled by Julius Caesar?',opts:{A:'Greek',B:'Ottoman',C:'Roman',D:'Byzantine'},ans:'C'},
  {cat:'📜 History',q:'What ship sank on its maiden voyage in 1912?',opts:{A:'Lusitania',B:'Britannic',C:'Olympic',D:'Titanic'},ans:'D'},
  {cat:'📜 History',q:'The Great Wall of China was primarily built to defend against which group?',opts:{A:'Mongols',B:'Persians',C:'Romans',D:'Vikings'},ans:'A'},
  {cat:'💡 Tech & Culture',q:"Who co-founded Apple Inc.?",opts:{A:'Bill Gates',B:'Elon Musk',C:'Steve Jobs',D:'Mark Zuckerberg'},ans:'C'},
  {cat:'💡 Tech & Culture',q:"What does 'www' stand for in a website URL?",opts:{A:'World Wide Web',B:'Wide World Web',C:'Web World Wide',D:'World Web Wide'},ans:'A'},
  {cat:'💡 Tech & Culture',q:'Which programming language was created by Guido van Rossum?',opts:{A:'Java',B:'Ruby',C:'Python',D:'Perl'},ans:'C'},
  {cat:'💡 Tech & Culture',q:'In which country was Nintendo founded?',opts:{A:'South Korea',B:'USA',C:'China',D:'Japan'},ans:'D'},
  {cat:'💡 Tech & Culture',q:'What does CPU stand for?',opts:{A:'Core Processing Unit',B:'Central Processing Unit',C:'Central Program Unit',D:'Computer Processing Unit'},ans:'B'},
  {cat:'💡 Tech & Culture',q:"Which film franchise features character 'Iron Man'?",opts:{A:'DC',B:'Star Wars',C:'Marvel',D:'X-Men separate universe'},ans:'C'},
  {cat:'💡 Tech & Culture',q:'What social media platform is known for its 280-character posts?',opts:{A:'Instagram',B:'Facebook',C:'LinkedIn',D:'X (Twitter)'},ans:'D'},
  {cat:'💡 Tech & Culture',q:'Which company makes the iPhone?',opts:{A:'Samsung',B:'Google',C:'Apple',D:'Sony'},ans:'C'},
  {cat:'💡 Tech & Culture',q:"What does 'AI' stand for?",opts:{A:'Automated Intelligence',B:'Artificial Intelligence',C:'Autonomous Interface',D:'Analog Input'},ans:'B'},
  {cat:'💡 Tech & Culture',q:'In what year was the first iPhone released?',opts:{A:'2005',B:'2006',C:'2007',D:'2008'},ans:'C'}
];
const rooms = new Map();
function code(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }
function lobby(room){ return {players:[...room.players.values()].map(p=>({id:p.id,name:p.name}))}; }
function publicQuestion(room){ const q=QUESTIONS[room.index]; return {index:room.index,cat:q.cat,q:q.q,opts:q.opts,endsAt:room.endsAt,timeLeft:Math.max(0,Math.ceil((room.endsAt-Date.now())/1000))}; }
function startQuestion(room){
  room.answers={}; room.index=room.index||0; room.endsAt=Date.now()+20000; room.started=true;
  io.to(room.code).emit('question', publicQuestion(room));
  clearTimeout(room.timeout); room.timeout=setTimeout(()=>resolveQuestion(room),20050);
}
function resolveQuestion(room){
  if(!rooms.has(room.code)) return;
  const q=QUESTIONS[room.index];
  const ids=[...room.players.keys()];
  ids.forEach(id=>{ if(!room.answers[id]) room.answers[id]={choice:null,status:'timeout'}; });
  ids.forEach(id=>{ const a=room.answers[id]; if(a.choice===q.ans){room.scores[id]++;room.stats[id].correct++;a.status='correct'} else if(a.choice){room.stats[id].wrong++;a.status='wrong'} else room.stats[id].timeout++; room.review.push({playerId:id,q:q.q,choice:a.choice,correct:q.ans,status:a.status}); });
  io.to(room.code).emit('reveal',{index:room.index,correct:q.ans,answers:room.answers,scores:room.scores});
  setTimeout(()=>{ if(!rooms.has(room.code)) return; room.index++; if(room.index>=QUESTIONS.length) finish(room); else startQuestion(room); },1800);
}
function finish(room){
  clearTimeout(room.timeout);
  const players=[...room.players.values()].map(p=>({id:p.id,name:p.name,score:room.scores[p.id],wrong:room.stats[p.id].wrong,timeout:room.stats[p.id].timeout}));
  const review=room.review;
  io.to(room.code).emit('game-over',{players,review});
  rooms.delete(room.code);
}
io.on('connection', socket=>{
  socket.on('create-room',()=>{ let c=code(); while(rooms.has(c)) c=code(); const room={code:c,players:new Map(),index:0,answers:{},scores:{},stats:{},review:[]}; room.players.set(socket.id,{id:socket.id,name:'Player'}); room.scores[socket.id]=0;room.stats[socket.id]={correct:0,wrong:0,timeout:0}; rooms.set(c,room); socket.join(c); socket.emit('room-created',{code:c}); io.to(c).emit('lobby',lobby(room)); });
  socket.on('join-room',({code})=>{ const room=rooms.get(String(code||'').toUpperCase()); if(!room) return socket.emit('room-error','Room not found. Check the code.'); if(room.players.size>=2) return socket.emit('room-error','Room is already full.'); room.players.set(socket.id,{id:socket.id,name:'Player'}); room.scores[socket.id]=0;room.stats[socket.id]={correct:0,wrong:0,timeout:0}; socket.join(room.code); socket.emit('joined',{code:room.code}); io.to(room.code).emit('lobby',lobby(room)); });
  socket.on('set-name',({code,name})=>{const room=rooms.get(String(code||'').toUpperCase()); if(room&&room.players.has(socket.id)){room.players.get(socket.id).name=String(name||'Player').slice(0,20);io.to(room.code).emit('lobby',lobby(room));}});
  socket.on('start-game',({code})=>{const room=rooms.get(String(code||'').toUpperCase());if(!room||room.players.size!==2||[...room.players.keys()][0]!==socket.id)return;room.index=0;room.review=[];room.scores={};room.stats={};room.players.forEach(p=>{room.scores[p.id]=0;room.stats[p.id]={correct:0,wrong:0,timeout:0}});room.started=true;io.to(room.code).emit('game-start',{index:0,scores:room.scores});startQuestion(room);});
  socket.on('answer',({code,choice})=>{const room=rooms.get(String(code||'').toUpperCase());if(!room||room.players.size!==2||room.answers[socket.id]||Date.now()>room.endsAt)return; const q=QUESTIONS[room.index]; if(!['A','B','C','D'].includes(choice))return; room.answers[socket.id]={choice,status:'pending'}; socket.emit('answer-ack',{}); socket.to(room.code).emit('opponent-answered'); if(Object.keys(room.answers).length===2) {clearTimeout(room.timeout); resolveQuestion(room);} });
  socket.on('disconnect',()=>{ for(const [c,r] of rooms){if(r.players.has(socket.id)){r.players.delete(socket.id);socket.to(c).emit('friend-left');if(r.players.size===0){clearTimeout(r.timeout);rooms.delete(c)} else if(!r.started){io.to(c).emit('lobby',lobby(r))}}}});
});

const PORT=process.env.PORT||3000;
server.listen(PORT,()=>console.log(`Quiz server running on port ${PORT}`));
