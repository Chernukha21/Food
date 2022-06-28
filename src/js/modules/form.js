import {closeModal,openModal} from "./modal";
import {postData} from "../services/services";

function formSubmit(formSelector,modalTimerId) {
    /**
     * Form submit;
     */
    const forms = document.querySelectorAll(formSelector);
    const message = {
        loading: 'icons/spinner.svg',
        success: 'success',
        failure: 'something wrong'
    }

    forms.forEach(el => bindPostData(el));



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
        openModal('.modal', modalTimerId);
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
            closeModal('.modal');
        }, 4000);
    }
}

export default formSubmit;