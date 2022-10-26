export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    // 6 - Objeto contendo as distancias do slide
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }

  // 8 - Atualiza a posição de x do transform do slide.
  moveSlide(distX) {
    // Salvamos no constructor o valor já movimentado pelo mouse
    // Assim o distX não recomeça sempre do zero quando clicamos e desclicamos.
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  // 7 - Método que atualiza a distancia do movimento feito pelo mouse
  updatePosition(clientX) {
    // Informa quanto se moveu no eixo x.
    // Atualiza a posição do moviment subtraindo a posição do mouse no eixo X
    // da posição de inicio. Então caso começemos em x = 220 e movamos o mouse 100px para esqueda
    // o novo movement será 120px. Isso descolaria o eixo x em 100px para direita.
    // Multiplicando o movent por um valor, isso fará com que seja necessário andar menos
    // Para caminhar mais.
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    // Retornamos a posição onde paramos e "soma ou subtrai" do finalPosition
    // Assim movemos o slide para a posição onde ele parou no eixo x.
    // Somando nós incrementamos o movePosition, o que faz com que deslocar para esquerda
    // mova o wrapper para a direita.
    // Subtraindo as coisas ficam no sentido natural.
    return this.dist.finalPosition - this.dist.movement;
  }

  // 1 - Criação do método que irá prevenir o "arraste de imagem" e
  // que ativa a função de mousemove, após um clique no wrapper.
  onStart(event) {
    event.preventDefault();
    // Adicionamos esse evento aqui, para ele apenas seja executado após o primeiro click
    // Assim a função onMove será executada sempre que movermos o mouse
    // Mas apenas após clicar no wrapper.
    this.wrapper.addEventListener('mousemove', this.onMove);
    // Passa para o dist o ponto de clique no eixo x
    this.dist.startX = event.clientX;
  }

  // 4 - Dados do evento de movimentação do mouse enquanto clicado.
  onMove(event) {
    // Armazena o valor do retorno da chamada do método updatePosition.
    const finalPosition = this.updatePosition(event.clientX);
    // Move o slide para a posição atualizada.
    this.moveSlide(finalPosition);
    console.log(this.dist);
  }

  // 5 - Remove o evento de mousemove ao "desclicar"
  onEnd(event) {
    this.wrapper.removeEventListener('mousemove', this.onMove);
    // Informarmos para o finalPosition a ultima posição no eixo x do mouse quando tiramos ele de cima.
    // E atualizamos no objeto.
    this.dist.finalPosition = this.dist.movePosition;
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
