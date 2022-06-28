function slider({container,slide,nextArrow,prevArrow,totalCounter,currentCounter, wrapper, field}){
    /**
     * Slider
     */
    const slides = document.querySelectorAll(slide);
    const slider = document.querySelector(container);
    const prev = document.querySelector(prevArrow);
    const next = document.querySelector(nextArrow);
    const total = document.querySelector(totalCounter);
    const current = document.querySelector(currentCounter);
    const slidesWrapper = document.querySelector(wrapper);
    const slidesField = document.querySelector(field);
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
}

export default slider;

