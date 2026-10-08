const STORAGE_KEY = 'lista-facil-tarefas';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'todas';
let editingId = null;

const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const priority = document.getElementById('priorityInput');
const submit = document.getElementById('submitBtn');
const list = document.getElementById('taskList');
const empty = document.getElementById('empty');
const total = document.getElementById('total');
const completed = document.getElementById('completed');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const visibleCount = document.getElementById('visibleCount');
const todayDate = document.getElementById('todayDate');

function save(){localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));}
function escapeHtml(text){const d=document.createElement('div');d.textContent=text;return d.innerHTML;}
function visibleTasks(){return tasks.filter(t=>filter==='todas'||(filter==='pendentes'&&!t.done)||(filter==='concluidas'&&t.done));}
function render(){
  const items=visibleTasks();
  const doneCount=tasks.filter(t=>t.done).length;
  const progress=tasks.length ? Math.round((doneCount/tasks.length)*100) : 0;
  list.innerHTML=items.map(t=>`<li class="task ${t.done?'done':''}">
    <button class="check" data-action="toggle" data-id="${t.id}" aria-label="Concluir tarefa"></button>
    <div class="task-main"><div class="task-text">${escapeHtml(t.text)}</div><div class="meta"><span class="priority ${t.priority}">${t.priority[0].toUpperCase()+t.priority.slice(1)}</span></div></div>
    <div class="actions"><button data-action="edit" data-id="${t.id}">Editar</button><button data-action="delete" data-id="${t.id}">Excluir</button></div>
  </li>`).join('');
  empty.style.display=items.length?'none':'block';
  total.textContent=tasks.length;
  completed.textContent=doneCount;
  progressBar.style.width=progress+'%';
  progressText.textContent=progress+'% feito';
  visibleCount.textContent=items.length+' '+(items.length===1?'item':'itens');
}
form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text)return;
  if(editingId){const t=tasks.find(x=>x.id===editingId);t.text=text;t.priority=priority.value;editingId=null;submit.textContent='Adicionar';}
  else tasks.unshift({id:Date.now().toString(),text,priority:priority.value,done:false});
  save();form.reset();priority.value='media';render();input.focus();
});
list.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;const id=btn.dataset.id;const action=btn.dataset.action;const t=tasks.find(x=>x.id===id);if(!t)return;
  if(action==='toggle')t.done=!t.done;
  if(action==='delete')tasks=tasks.filter(x=>x.id!==id);
  if(action==='edit'){editingId=id;input.value=t.text;priority.value=t.priority;submit.textContent='Salvar';input.focus();}
  save();render();
});
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');filter=btn.dataset.filter;render();}));
document.getElementById('clearCompleted').addEventListener('click',()=>{tasks=tasks.filter(t=>!t.done);save();render();});
todayDate.textContent=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit'}).format(new Date());
render();
