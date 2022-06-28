function timer(id, deadLine) {
    /**
     * timer
     */

    function getTimeRemaining(endtime){
        let days,hours, minutes, seconds;
        let t = Date.parse(endtime) - Date.parse(new Date());
        if(t <= 0){
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        }else{
            days = Math.floor(t/(1000*60*60*24));
            hours = Math.floor((t / (1000 * 60 * 60) % 24));
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000 ) % 60);
        }
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
    setClock(id, deadLine);
}
export default timer;