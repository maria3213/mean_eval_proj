const api = (()=>{
    const getData = fetch("https://random-word-api.herokuapp.com/word").then(res => res.json())
    return {
        getData
    }
})();

var words = [
    "ballot",
    "soil",
    "legislation",
    "valley",
    "country",
    "nail",
    "piano",
    "speech",
    "efflux",
    "reason",
    "alcohol",
    "stable",
    "slice",
    "situation",
    "profession",
    "restaurant",
    "pocket",
    "satisfaction",
    "condition",
    "comfortable"
];

const randomWord = ()=>{
    return words[Math.floor(Math.random() * words.length)];
}



const View = (()=>{
    let domSelector = {
        word: ".main__word",
        wrongNum: ".header__wrong",
        input: ".main__input",
        btn:".main__btn",
    }

    const createTmp = (arr)=>{
        let tmp = "";
        arr.forEach((char)=>{
            tmp += `<span>${char} </span>`
        })
        return tmp;
    }

    const render = (ele,temp)=>{
        ele.innerHTML = temp;
    }
    const renderWrong = (num)=>{
        const wrongElem = document.querySelector(domSelector.wrongNum);
        wrongElem.innerText = num;
    }
    const clearInput = ()=>{
        const input = document.querySelector(domSelector.input);
        input.value = "";
    }
    const renderHist = (char,correct)=>{
        const histElem = document.querySelector(".main__history");
        const span = document.createElement("span");
        span.innerText = char;
        if (correct){
            span.style.color = "green";
        }else{
            span.style.color = "red";
        }
        histElem.appendChild(span);
    }
    const clearHist = ()=>{
        const histElem = document.querySelector(".main__history");
        histElem.innerHTML = "";
    }
    return {
        domSelector,
        createTmp,
        render,
        renderWrong,
        clearInput,
        renderHist,
        clearHist
    }
})();

const Model = ((view,api)=>{
    const {domSelector} = view;
    class State{
        constructor(){
            this._word = "";
            this.currentWord = [];
            this.answer = [];
            this.wrong = 0;
            this.correct = 0;
            this.history = [];
        }
        get word(){
            return this._word;
        }
        set word(word){
            this._word = word;
        }

        setCurrentWord(startover,clearWrong){
            this.word = randomWord();
            //if using api to fetch data:
            // api.getData.then((data)=>{
            //     this._word = data[0];
            //     this.currentWord = this._word.split("");
            // })
            this.currentWord = this._word.split("");
            this.answer = [];
            if (clearWrong){
                this.wrong = 0;
                this.correct = 0;
            }
            if (startover){
                this.history = [];
                view.clearHist();
            }
            let guessNum = Math.floor(Math.random() * (this.currentWord.length-1)) + 1 
            const arr = [];
            while (guessNum>0){
                const idx = Math.floor(Math.random() * this._word.length);
                if (arr.includes(idx)){
                    continue;
                }else{
                    arr.push(idx);
                    this.answer.push(this._word[idx]);
                    this.currentWord[idx]= "_";
                    guessNum--;
                }  
            }
        }

        initRender(startover = false,clearWrong = false){
            this.setCurrentWord(startover,clearWrong);
            const wordElem = document.querySelector(domSelector.word);
            view.render(wordElem,view.createTmp(this.currentWord));
            view.renderWrong(this.wrong);
        }

        renderInput(char){
            if (this.history.includes(char) && !this.answer.includes(char)){
                alert("You have already guessed this letter!")
                return;
            }else{
                this.history.push(char);
            }

            if (this.answer.includes(char)){
                for (let i=0;i<this.currentWord.length;i++){
                    if (this.currentWord[i]==="_" && this._word[i] === char){
                        this.currentWord[i] = char;
                        this.answer.splice(this.answer.indexOf(char),1);
                        break;
                    }
                }
                const wordElem = document.querySelector(domSelector.word);
                view.render(wordElem,view.createTmp(this.currentWord));
                view.renderHist(char,true)
            }else{
                this.wrong++;
                view.renderWrong(this.wrong);
                
                view.renderHist(char,false)
            }

            setTimeout(()=>{
                if (this.answer.length === 0 && this.wrong < 10){
                    this.initRender(true,false);
                    this.correct++;
                }
            },500);
        }
    }
    return {
        State,
    }

})(View,api);

const Controller = ((model,view)=>{
    const {State} = model;
    const {domSelector} = view;
    const state = new State(); 
    
    var intervalId;
    var startTimer = (startover=false,clearWrong=false)=> {
        let timeLeft = 60;
        if (startover){state.initRender(true,true);}
        intervalId = setInterval(() => {
            timeLeft--;
            console.log(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(intervalId); 
                alert("Time's up! Click OK to start again."); 
                state.initRender(startover,clearWrong); 
                timeLeft = 60; 
                startTimer(); 
            }
        }, 1000);
    };

    const init = ()=>{
        state.initRender();
        startTimer(); 

    }
    const enterGuess = ()=>{
        const input = document.querySelector(domSelector.input);
        input.addEventListener("keyup",(e)=>{

            if (e.keyCode === 13 && state.wrong === 10){
                clearInterval(intervalId)
                alert(`Game Over!You have guessed ${state.correct} words!`)
                e.target.value = "";
                // state.initRender(true);
                startTimer(true,true);
                return;
            }
            if(e.keyCode === 13 && e.target.value.length === 1){
                state.renderInput(e.target.value);
                e.target.value = "";
            }
        })
    }
    const newGame = ()=>{
        const btn = document.querySelector(domSelector.btn);
        btn.addEventListener("click",()=>{
            clearInterval(intervalId);
            state.initRender(true,true);
            view.clearInput();
            startTimer();
        })
    }
    const bootstrap = () =>{
        init()
        enterGuess()
        newGame()
    }
    return {
        bootstrap
    }

})(Model,View);

Controller.bootstrap()
