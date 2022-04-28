require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';
import tabs from './modules/tabs';
import modal, {openModal} from './modules/modal';
import form from './modules/form';
import cards  from './modules/cards';
import slider from './modules/slider';
import calculation from './modules/calculation';
import timer from './modules/timer';

window.addEventListener('DOMContentLoaded', e => {
    const modalTimerId = setTimeout(() => openModal('.modal',modalTimerId), 60000);
    tabs('.tabheader__item','.tabcontent','.tabheader__items','tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    form('form', modalTimerId);
    cards();
    slider({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        slide: '.offer__slide',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
    calculation();
    timer('.timer','2022-12-25');
});
