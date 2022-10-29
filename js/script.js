import { Slide, SlideNav } from './slide.js';
// Como estou extendendo a classe Slide, preciso usar a classe nova abaixo.
const slide = new SlideNav('.slide', '.slider-wrapper');
slide.init();
slide.addArrow('.prev', '.next');
slide.addControl();
