window.addEventListener('DOMContentLoaded', e => {
    /**
     *
     * tabs elements
     */
    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');
    const bntClose = document.querySelector('[modal-close]');

    
    function hideTabContent() {
        tabsContent.forEach(el => {
            el.classList.add('hide');
            el.classList.remove('show','fade');
        });
        tabs.forEach(el => {
            el.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(n    = 0) {
        tabsContent[n].classList.add('show','fade');
        tabsContent[n].classList.remove('hide');
        tabs[n].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click', e => {
        if(e.target && e.target.classList.contains('tabheader__item')){
            tabs.forEach((el,i) => {
                if(e.target == el){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
    /**
     * timer
     */
    const deadLine = '2022-12-25';
    function getTimeRemaining(endtime){
        let t = Date.parse(endtime) - Date.parse(new Date());
        let days = Math.floor(t/(1000*60*60*24));
        let hours = Math.floor((t / (1000 * 60 * 60) % 24));
        let minutes = Math.floor((t / 1000 / 60) % 60);
        let seconds = Math.floor((t / 1000 ) % 60);
        return {
            'total' : t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function checkZero(n) {
        if(n >= 0 && n < 10){
            return `0${n}`;
        } else {
            return n;
        }
    }
    
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        let timeInterval = setInterval(updateClock,1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = checkZero(t.days);
            hours.innerHTML = checkZero(t.hours);
            minutes.innerHTML = checkZero(t.minutes);
            seconds.innerHTML = checkZero(t.seconds);
            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadLine);

    /**
     * modal window
     */
    const btnTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');

    btnTrigger.forEach(el => {
        el.addEventListener('click', openModal);
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal(){
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    bntClose.addEventListener('click', closeModal);

    modal.addEventListener('click', e => {
        if(e.target === modal || e.target.getAttribute('data-close') == ""){
            closeModal();
        }
    });
    document.addEventListener('keydown', e => {
        if(e.code == 'Escape' && modal.classList.contains('show')){
            closeModal();
        }
    })

    const modalTimerId = setTimeout(openModal, 60000);

    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    /**
     * Using Classes
     */
    class MenuCard {
        constructor(src,alt,title,descr,price,parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUa();
        }
        changeToUa(){
            this.price = this.price * this.transfer;
        }
        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML =
                `
                            <img src=${this.src} alt=${this.alt}>
                            <h3 class="menu__item-subtitle">${this.title}</h3>
                            <div class="menu__item-descr">${this.descr}</div>
                            <div class="menu__item-divider"></div>
                            <div class="menu__item-price">
                                <div class="menu__item-cost">Цена:</div>
                                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                            </div>
                `;
            this.parent.append(element);
        }
    }

    const getResources = async (url) => {
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status ${res.status}`)
        }
        return await res.json();
    }

    axios.get('http://localhost:3000/menu').then(data => {
          data.data.forEach(({img,altimg,title,descr,price}) => {
            new MenuCard(img,altimg,title,descr,price,'.menu .container').render();
        })
    });

    /**
     * Form submit;
     */
    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'icons/spinner.svg',
        success: 'success',
        failure: 'something wrong'
    }

    forms.forEach(el => bindPostData(el));

    const postData = async (url,data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', e => {
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `display: block; margin: 0 auto`;
            form.append(statusMessage);

            e.preventDefault();

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            console.log(json);
            postData('http://localhost:3000/requests', json)
              .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }
    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() =>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    /**
     * Slider
     */
    const slides = document.querySelectorAll('.offer__slide');
    const slider = document.querySelector('.offer__slider');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current = document.querySelector('#current');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width;
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(el => el.style.width = width);
    slider.style.position = 'relative';
    const dots = document.createElement('ol');
    const indicators = [];
    dots.classList.add('carousel-indicators');
    slider.append(dots);

    for(let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if(i == 0){
            dot.style.opacity = '1';
        }
        dots.append(dot);
        indicators.push(dot);
    }

    let offset = 0;
    let slideIndex = 1;
    if (slideIndex < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length.toString();
        current.textContent = slideIndex;
    }
    next.addEventListener('click', e => {
        if(offset === deleteNotDigits(width) * (slides.length - 1)){
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }
        if(slideIndex === slides.length){
            slideIndex = 1;
        }else{
            slideIndex++;
        }
        duplicateStatement();
    });

    prev.addEventListener('click', e => {
        if(offset === 0){
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }
        if(slideIndex == 1){
            slideIndex = slides.length;
        }else{
            slideIndex--;
        }
        duplicateStatement();
    });

    indicators.forEach(dot => {
        dot.addEventListener('click', e => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;
            indicators.forEach(dot => dot.style.opacity = '0.5');
            indicators[slideIndex - 1].style.opacity = '1';
            if(slides.length < 10){
                current.textContent = `0${slideIndex}`;
            }else{
                current.textContent = slideIndex;
            }
        })

    });

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    function duplicateStatement() {
        slidesField.style.transform = `translateX(-${offset}px)`;
        if(slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }
        indicators.forEach(dot => dot.style.opacity = '0.5');
        indicators[slideIndex - 1].style.opacity = '1';
    }

    /* slider second variant */
    // showSlides(slideIndex);
    // if(slideIndex < 10){
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length.toString();
    // }
    // function showSlides(n) {
    //     if(n > slides.length){
    //         slideIndex = 1;
    //     }
    //     if(n < 1){
    //         slideIndex = slides.length;
    //     }
    //     slides.forEach(el => el.classList.add('hide','fade'));
    //     slides[slideIndex - 1].classList.remove('hide');
    //     if(slideIndex < 10){
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }
    // function plusSlides(n) {
    //     showSlides(slideIndex += n);
    // }
    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });
    // next.addEventListener('click', () => {
    //     plusSlides(+1);
    // });
    /**
     * Calculator of calories
     */

    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if(localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    }else{
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    if(localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    }else{
        localStorage.setItem('ratio', 1.375);
        ratio = 1.375;
    }

    function initLocalSettings(selector, activeClass){
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.remove(activeClass);
            if(el.getAttribute('id') === localStorage.getItem('sex')){
                el.classList.add(activeClass);
            }
            if(el.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                el.classList.add(activeClass);
            }
        })
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = `Заполните все поля`;
            return;
        }
        if(sex === 'female'){
            result.textContent = Math.floor(Number((447 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio));
        }else{
            result.textContent = Math.floor(Number((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio));
        }
    }
    calcTotal();
    function getStaticInfo(selector, activeClass){
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener('click', (e) => {
                if(e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                }else{
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
                console.log(sex,ratio);
                elements.forEach(el => el.classList.remove(activeClass));
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }
    getStaticInfo('#gender div', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', e => {
            if(input.value.match(/\D/g)){
                input.style.border = '2px solid red';
            }else{
                input.style.border = 'none';
            }
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        })
    }
    getDynamicInfo('#height');
    getDynamicInfo( '#weight');
    getDynamicInfo( '#age');
});
