function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, active) {
    /**
     *
     * tabs elements
     */
    const tabs = document.querySelectorAll(tabsSelector);
    const tabsContent = document.querySelectorAll(tabsContentSelector);
    const tabsParent = document.querySelector(tabsParentSelector);


    function hideTabContent() {
        tabsContent.forEach(el => {
            el.classList.add('hide');
            el.classList.remove('show','fade');
        });
        tabs.forEach(el => {
            el.classList.remove(active);
        });
    }

    function showTabContent(n    = 0) {
        tabsContent[n].classList.add('show','fade');
        tabsContent[n].classList.remove('hide');
        tabs[n].classList.add(active);
    }

    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click', e => {
        if(e.target && e.target.classList.contains(tabsSelector.slice(1))){
            tabs.forEach((el,i) => {
                if(e.target == el){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

export default tabs;