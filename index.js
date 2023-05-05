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
    return {
        domSelector,
        createTmp,
        render,
        renderWrong,
        clearInput
    }
})();

const Model = ((view)=>{
    const {domSelector} = view;
    class State{
        constructor(){
            this._word = "";
            this.currentWord = [];
            this.answer = [];
            this.wrong = 0;
            this.correct = 0;
        }
        get word(){
            return this._word;
        }
        set word(word){
            this._word = word;
        }

        setCurrentWord(startover = false){
            this.word = randomWord();
            this.currentWord = this._word.split("");
            this.answer = [];
            if (startover){
                this.wrong = 0;
                this.correct = 0;
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

        initRender(startover = false){
            this.setCurrentWord(startover);
            const wordElem = document.querySelector(domSelector.word);
            view.render(wordElem,view.createTmp(this.currentWord));
            view.renderWrong(this.wrong);
        }

        renderInput(char){
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
            }else{
                this.wrong++;
                view.renderWrong(this.wrong);
            }

            setTimeout(()=>{
                if (this.answer.length === 0 && this.wrong < 10){
                    this.initRender();
                    this.correct++;
                }
            },500);
        }
    }
    return {
        State,
    }

})(View);

const Controller = ((model,view)=>{
    const {State} = model;
    const {domSelector} = view;
    const state = new State(); 
    const init = ()=>{
        state.initRender();
    }
    const enterGuess = ()=>{
        const input = document.querySelector(domSelector.input);
        input.addEventListener("keyup",(e)=>{
            if (e.keyCode === 13 && state.wrong === 10){
                alert(`Game Over!You have guessed ${state.correct} words!`)
                e.target.value = "";
                state.initRender(true);
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
            state.initRender(true);
            view.clearInput();
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
