// Disciplina de Desenvolvimento de Aplicativos Moveis
const lista = document.getElementById("lista-tarefas");
const campo = document.getElementById("campo-tarefa");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtro = "todas";

function salvar(){
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizar(){

  lista.innerHTML = "";

  let tarefasFiltradas = tarefas.filter(tarefa => {
    if(filtro === "pendentes") return !tarefa.concluida;
    if(filtro === "concluidas") return tarefa.concluida;
    return true;
  });

  tarefasFiltradas.forEach((tarefa, index) => {

    const li = document.createElement("li");
    li.className = "item-tarefa";

    if(tarefa.concluida) li.classList.add("concluida");

    li.innerHTML = `
      <input type="checkbox" ${tarefa.concluida ? "checked" : ""}>
      <span>${tarefa.texto}</span>
      <div class="acoes-tarefa">
        <button class="btn-acao btn-editar">✏️</button>
        <button class="btn-acao btn-excluir">X</button>
      </div>
    `;

    li.querySelector("input").addEventListener("change", () => {
      tarefa.concluida = !tarefa.concluida;
      salvar();
      renderizar();
    });

    li.querySelector(".btn-editar").addEventListener("click", () => {
      const novoTexto = prompt("Editar tarefa:", tarefa.texto);
      if(novoTexto && novoTexto.trim() !== "") {
        tarefa.texto = novoTexto.trim();
        salvar();
        renderizar();
      }
    });

    li.querySelector(".btn-excluir").addEventListener("click", () => {
      tarefas.splice(index, 1);
      salvar();
      renderizar();
    });

    lista.appendChild(li);
  });
}

function adicionarTarefa(){
  const texto = campo.value.trim();
  if(texto === "") return;
  tarefas.push({ texto, concluida: false });
  salvar();
  renderizar();
  campo.value = "";
}

document.getElementById("btn-adicionar").addEventListener("click", adicionarTarefa);

campo.addEventListener("keypress", e => {
  if(e.key === "Enter") adicionarTarefa();
});

document.querySelectorAll(".btn-filtro").forEach(botao => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".btn-filtro").forEach(btn => btn.classList.remove("ativo"));
    botao.classList.add("ativo");
    filtro = botao.dataset.filtro;
    renderizar();
  });
});

renderizar();


const canvas = document.getElementById("fundo-canvas");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

let particulas = [];

for(let i = 0; i < 50; i++){
  particulas.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3,
    dx: (Math.random() - 0.5),
    dy: (Math.random() - 0.5)
  });
}

function animar(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particulas.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(animar);
}

animar();