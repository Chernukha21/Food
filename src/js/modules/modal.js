function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    console.log(modalTimerId);
    if(modalTimerId){
        clearInterval(modalTimerId);
    }

}

function closeModal(modalSelector){
    const modal = document.querySelector(modalSelector);
    modal.classList.remove('show');
    modal.classList.add('hide');
    document.body.style.overflow = '';
}

function showModal(triggerSelector,modalSelector, modalTimerId){
    /**
     * modal window
     */
    const btnTrigger = document.querySelectorAll(triggerSelector);
    const modal = document.querySelector(modalSelector);
    const bntClose = document.querySelector('[modal-close]');

    btnTrigger.forEach(el => {
        el.addEventListener('click', () => openModal(modalSelector,modalTimerId));
    });

    bntClose.addEventListener('click', () => closeModal(modalSelector));

    modal.addEventListener('click', e => {
        if(e.target === modal || e.target.getAttribute('data-close') == ""){
            closeModal(modalSelector);
        }
    });
    document.addEventListener('keydown', e => {
        if(e.code == 'Escape' && modal.classList.contains('show')){
            closeModal(modalSelector);
        }
    })



    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal(modalSelector,modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

export default showModal;
export {openModal,closeModal};
