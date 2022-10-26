export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }
  // 1 - Criação do método que irá prevenir o "arraste de imagem" e
  // que ativa a função de mousemove, após um clique no wrapper.
  onStart(event) {
    event.preventDefault();
    // Adicionamos esse evento aqui, para ele apenas seja executado após o primeiro click
    // Assim a função onMove será executada sempre que movermos o mouse
    // Mas apenas após clicar no wrapper.
    this.wrapper.addEventListener('mousemove', this.onMove);
  }

  // 4 - Dados do evento de movimentação do mouse enquanto clicado.
  onMove(event) {}

  // 5 - Remove o evento de mousemove ao "desclicar"
  onEnd(event) {
    this.wrapper.removeEventListener('mousemove', this.onMove);
  }

  // 2 - Adiciona o evento de mousedown ao wrapper, e inicia a função onStart após clique.
  addSlideEvents() {
    // Adiciona o evento de clique e arraste sobre as imagens
    // E executa a função onStart, que previne que a imagem seja "arrastada"
    this.wrapper.addEventListener('mousedown', this.onStart);
    // Adiciona o evento de "desclique" ao wrapper e executa a função onEnd.
    this.wrapper.addEventListener('mouseup', this.onEnd);
  }

  // 3 - Modifica e adiciona ao constructor o bind dos métodos.
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
