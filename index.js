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
        const wrongElem = document.querySelector(".wrong");
        wrongElem.innerText = num;
    }
    const clearInput = ()=>{
        const input = document.querySelector(".input");
        input.value = "";
    }
    return {
        createTmp,
        render,
        renderWrong,
        clearInput
    }
})();

const Model = ((view)=>{

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

        //set new word, new current word, new answer
        setCurrentWord(startover = false){
            this.word = randomWord();
            this.currentWord = this._word.split("");
            this.answer = [];
            if (startover){
                this.wrong = 0;
                this.correct = 0;
            }
            let guessNum = Math.floor(Math.random() * (this.currentWord.length-1)) + 1 //should bigger that 0
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
            console.log(this.word);
            console.log(this.answer);
        }

        //initial render:generate a random word and set/render current word
        initRender(startover = false){
            
            this.setCurrentWord(startover);
            const wordElem = document.querySelector(".word");
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
                const wordElem = document.querySelector(".word");
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
    const state = new State(); 

    const init = ()=>{
        state.initRender();
    }
    const enterGuess = ()=>{
        const input = document.querySelector(".input");
        input.addEventListener("keyup",(e)=>{
            if (e.keyCode === 13 && state.wrong === 10){
                alert(`Game Over!You have guessed ${state.correct} words!`)
                e.target.value = "";
                return;
                
            }
            if(e.keyCode === 13 && e.target.value.length === 1){
                state.renderInput(e.target.value);
                e.target.value = "";
            }
        })
    }
    const newGame = ()=>{
        const btn = document.querySelector(".btn");
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