import debounce from './debounce.js';
export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    // 6 - Objeto contendo as distancias do slide
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = 'active';
    // Podemos criar eventos.
    // Assim como existem os eventos de click, esse será um novo evento.
    // Esse evento será ativado quando chamarmos o StatEvent
    // Toda vez que mudar o slide (ver changeSlide), ativar o evento.
    this.changeEvent = new Event('changeEvent');
  }

  // Aplica um efeito de transição nos slides.
  // Para que o efeito seja feito apenas quando realizarmos a transição, criamos o método
  // Pois sem ele, o efeito aconteceria a cada movimentação de 1px
  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
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
    // Recebe o tipo de movimento que está sendo feito
    let movetype;
    // Verifica o tipo de evento, para tomar diferentes ações
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = 'mousemove';
    } else {
      // Passa para o dist o ponto de clique no eixo x
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = 'touchmove';
    }
    // Adicionamos esse evento aqui, para ele apenas seja executado após o primeiro click
    // Assim a função onMove será executada sempre que movermos o mouse
    // Mas apenas após clicar no wrapper.
    // Fica fora do ifelse pois recebe o parametro do tipo de movimento desse check.
    // Assim não precisamos adionar a linha abaixo no ifelse
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  // 4 - Dados do evento de movimentação do mouse enquanto clicado.
  onMove(event) {
    // Para passar o valor correto e tipo de evento para o updatePosition
    // precisamos pegar a posição através do client X ou changedTouches
    const pointerPosition =
      event.type === 'mousemove'
        ? event.clientX
        : event.changedTouches[0].clientX;
    // Armazena o valor do retorno da chamada do método updatePosition.
    const finalPosition = this.updatePosition(pointerPosition);
    // Move o slide para a posição atualizada.
    this.moveSlide(finalPosition);
  }

  // 5 - Remove o evento de mousemove ao "desclicar"
  onEnd(event) {
    // Vericamos o tipo de movimento para armazenar a ultima coordenada correta.
    const movetype = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(movetype, this.onMove);
    // Informarmos para o finalPosition a ultima posição no eixo x do mouse quando tiramos ele de cima.
    // E atualizamos no objeto.
    this.dist.finalPosition = this.dist.movePosition;
    // Tem que estar acima do changeSlideOnEnd, senão o efeito só será adicionado
    // quando a mudança já tiver ocorrido.
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  // 2 - Adiciona o evento de mousedown ao wrapper, e inicia a função onStart após clique.
  addSlideEvents() {
    // Adiciona o evento de clique e arraste sobre as imagens
    // E executa a função onStart, que previne que a imagem seja "arrastada"
    this.wrapper.addEventListener('mousedown', this.onStart);
    // Evento similar ao mousedown porém para mobile
    this.wrapper.addEventListener('touchstart', this.onStart);
    // Adiciona o evento de "desclique" ao wrapper e executa a função onEnd.
    this.wrapper.addEventListener('mouseup', this.onEnd);
    // Evento similar ao mouseup, porém para mobile
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // 3 - Modifica e adiciona ao constructor o bind dos métodos.
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onRisize = debounce(this.onRisize.bind(this), 200);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  // 9 - Slides config

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    //Retorna a posição do slide ja descontando a margin, assim, o slide ficara centralizado.
    return -(slide.offsetLeft - margin);
  }
  // 10 - Método para pegar as configurações das imagens, afim de deixar no meio da tela.
  slidesConfig() {
    // Desestrutura o nodelist slide, e salva os filhos (lis) num array.
    // Esse array é modificado pelo map, que nos retorna um array de objetos
    // Contendo a posição esquerda de cada um dos elementos.
    this.slideArray = [...this.slide.children].map((element) => {
      // Armazena a posição do slide, já contando a margin.
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  // 11 - Movimenta o slide para o slide do index informado.
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    // Emite o evento criado.
    // Assim podemos ficar observando esse evento e tomar ações quando ele mudar.
    this.wrapper.dispatchEvent(this.changeEvent);
  }

  // 20 - Remove a classe ativo de todos os itens do array, e depois adiciona no atual
  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass)
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }
  // Armazena a informação do slide atual, anterior e proximo.
  slidesIndexNav(index) {
    // Para que não tenhamos slide -1 ou mais slides do que existe, medimos o ultimo.
    const last = this.slideArray.length - 1;
    this.index = {
      // Verifica se o index é diferente de 0 (true), caso sim o slide anterior será index -1
      // Caso seja false (0), será undefined
      prev: index ? index - 1 : undefined,
      active: index,
      //Verificamos se o slide é igual ao ultimo, caso seja o proximo será undefined.
      // Caso não, será index do atual + 1
      next: index === last ? undefined : index + 1,
    };
  }
  // Movimenta para o slide anterior
  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }
  // 21 - Quando alteramos o tamanho da tela, nosso slide fica bugado
  // Pois tinha referencias das posições antigas.
  // Para isso adicionamos um evento de risize
  // Para que quando houver um risize, as configurações do slide serão feitas novamente.
  onRisize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onRisize);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  }
}

// Extentendo a classe Slide para que a classe SlideNav tenha acesso aos seus métodos e propriedades
// Não precisa criar um construtor caso o construtor seja o mesmo.
export default class SlideNav extends Slide {
  constructor(slide, wrapper) {
    super(slide, wrapper);
    this.bindControlEvents();
  }
  // 22 - Faz a seleção dos botões
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }

  createControl() {
    // Uma ul, com data-control = 'slide'
    const control = document.createElement('ul');
    control.dataset.control = 'slide';
    // Adiciona dentro de cada ul, um li, com um link
    // O href desse link será op Slide+index do slide.
    this.slideArray.forEach((item, index) => {
      // O +1 no index, é apenas para visualizações.
      // Caso o usuario veja, o index não começa no zero.
      control.innerHTML += `<li><a href="#slide${index + 1}">${
        index + 1
      }</a></li>`;
    });
    this.wrapper.appendChild(control);
    return control;
  }

  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
    // Toda vez que mudar um slide, o evento será ativo.
    this.wrapper.addEventListener('changeEvent', this.activeControlItem);
  }

  activeControlItem() {
    this.controlArray.forEach((item) =>
      item.classList.remove(this.activeClass)
    );
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    // Tranformou o control em um array de lis
    this.controlArray = [...this.control.children];
    // Para cada item do array, chamamos a função eventControl.
    // Essa funçao adiciona o evento de click e muda o slide.
    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }

  bindControlEvents() {
    // Fazemos o bind aqui, pois esse é o callback da função.
    // Caso não fizessemos, o this seria referente aos items (lis) do eventControl.
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}
