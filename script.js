const cells = document.querySelectorAll('.cell');
const titleHeader = document.querySelector('#titleHeader');
const xPlayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');
const restartBtn = document.querySelector('#restartBtn');

// INITIALIZE VARIABLES FOR THE GAME

let player = 'X'
let isGamePause = false
let isGameStart = false

//ARRAY OF INPUT CONDITIONS

const inputCells = ['', '', '',
                    '', '', '',
                    '', '', '']

//ARRAY OF WIN CONDITIONS

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], //Rows
    [0,3,6], [1,4,7], [2,5,8], //Columns
    [0,4,8], [2,4,6] //Diagonal
]

//ADD CLICK EVENT LISTENER TO EACH CELL

cells.forEach((cell, index) =>{
    cell.addEventListener('click', () => tapcell(cell, index))
})

function tapcell(cell, index){
    //ENSURE CELL IS NOT EMPTY AND GAME IS NOT PAUSED
    if(cell.textContent == '' && !isGamePause){
        isGameStart=true
        updateCell(cell,index)

        //DO A RANDOM PIC IF THERE IS NO RESULT
        if(!checkWinner()){
            changePlayer()
            randomPick()
        }
    }
}

function updateCell(cell,index){
    cell.textContent = player;
    inputCells[index]=player;
    cell.style.color = (player == 'X') ? '#ff0059' : '#0084ff'
}

function changePlayer(){
    player = (player == 'X') ? 'O' : 'X'
}

function  randomPick(){
    //PAUSE THE GAME TO LET COMPUTER PICK
    isGamePause = true

    setTimeout(() =>{
        let randomIndex
        do{
            //PICK A RANDOM INDEX
            randomIndex = Math.floor(Math.random() * inputCells.length)
        } while (
            //ENSURE THE CELL IS EMPTY
            inputCells[randomIndex] != ''
        )
        //UPDATE CELL WITH COMPUTER MOVE
        updateCell(cells[randomIndex], randomIndex, player)
        //CHECK IF COMPUTER WON
        if(!checkWinner()){
            changePlayer()
            //SWITCH BACK TO USER
            isGamePause=false
            return
        }
    },1000) //DELAY COMPUTER MOVE BY 1 SECOND
}

function checkWinner(){
    for (const [a, b, c] of winConditions){
        //CHECK EACH WINNING CONDITION 
        if(inputCells[a]==player && inputCells[b]==player && inputCells[c]==player){
            declareWinner([a, b ,c])
            return true
        }
    }

    //CHECK FOR A DRAW( IF ALL CELLS ARE FILLED)
    if(inputCells.every(cell => cell != '')){
        declareDraw();
        return true
    }
}

function declareWinner(winningIndices){
    titleHeader.textContent = `${player} Win!`
    isGamePause = true

    //HIGHLIGHT WINNING INDICES
    winningIndices.forEach((index) => cells[index].style.background = '#2A2343')

    restartBtn.style.visibility = 'visible'
}

function declareDraw(){
    titleHeader.textContent = 'Draw!'
    isGamePause = true
    restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer){
    //ENSURE THE GAME HASN'T STARTED
    if(!isGameStart){
        //OVERRIDE THE SELECTED PLAYER VALUE
        player = selectedPlayer
        if(player == 'X'){
            //HIGHLIGHT X DISPLAY
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        }
        else{
            //HIGHLIGHT O DISPLAY
            oPlayerDisplay.classList.add('player-active')
            xPlayerDisplay.classList.remove('player-active')
        }
    }
}

restartBtn.addEventListener('click', ()=>{
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('')
    cells.forEach(cell =>{
        cell.textContent = ''
        cell.style.background = ''
    })
    isGamePause = false
    isGameStart = false
    titleHeader.textContent = 'Choose'
})