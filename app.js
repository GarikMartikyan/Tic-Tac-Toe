let n ;

//Used Html elements
const container = document.getElementById('container');
const modal = document.getElementById('modal');
const totalScore = document.getElementById('totalScore');
const form = document.getElementById('sizeForm');
const inputWindow = document.getElementById('input');
const content = document.getElementById('content');

//Total score counter
const winCount = {X: 0, O: 0};


let player = "X";
const coords = { X: [], O: []}
let clickCount = 0;



form.size.focus();
form.onsubmit = start;

function start(event) {
    event.preventDefault();

    n = +form.size.value;

    let isValid =  n < 3 || n > 10 || n % 1 !== 0;
    //Input Number check
    if (isValid){
      document.getElementById('warning').style.color = 'red';
      document.getElementById('warning').style.fontWeight = 'bolder';
      return
    }
    inputWindow.style.display = 'none';
    content.style.display = 'block';
    createField(n);
}




function createField(size) {

  for (let i = 0; i < size; i++) {

    //Creating rows for table
    let row = document.createElement('div');
    row.classList.add('row');
    container.append(row);

    for (let j = 0; j < size; j++) {

      //Creating cells in rows
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = `${i}`;
      cell.dataset.y = `${j}`;
      row.append(cell);
    }

  }

  //Making cells square an
  cellSize(size)
  window.onresize = cellSize.bind(null, size);


}
function cellSize(fieldSize) {

  const cells = document.querySelectorAll('.cell');
  const gap = 15 - fieldSize;

  for (const cell of cells) {

    const width = container.offsetWidth / fieldSize - gap;
    //Cell sizes change depending on field sizes
    cell.style.width = width + 'px';

    //Cell's font-size change depending on width
    cell.style.fontSize = `${width * 0.5}px`;
  }
}
//Game's logic
container.onclick = gameLogic;
function gameLogic(event) {
  const cell = event.target.closest('.cell');

  //In case of clicked is not td element 0r empty
  if (!cell || cell.innerHTML) return;


  clickCount++;

  //Getting cell coords
  const x = +cell.dataset.x;
  const y = +cell.dataset.y;

  //Adding X/O in cell
  cell.textContent = player;

  //Adding coords in X's/O's positions
  const positions = player === 'X' ? coords.X : coords.O;
  positions.push([x, y]);
  console.log(coords)

  //In case of draw
  if ( clickCount === n * n  && !winCheck(n, positions)) {
    gameOver(player, true);
  }else  if (winCheck(n, positions)) {
    gameOver(player, false);
  }

  //Player change
  player = player === 'X' ? 'O' : 'X';

}



//Win checking (In case of win returns true)
function winCheck(size, positions) {

  //First win possible after (size*2 - 1) clicks
  if (clickCount < (2 * size) - 1) return;

  for (let i = 0; i < size; i++) {

    const result = positions.reduce(([horizontal , vertical], item) =>{

      if (item[0] === i) horizontal++;
      if (item[1] === i) vertical++;

      return [horizontal, vertical];

    },[0,0])

    //Checking horizontal and vertical lines
    if (result.includes(size)) return true;
  }


  let result = positions.reduce(([diagonal1, diagonal2], item) =>{
    if (item[0] === item[1]) diagonal1++;
    if (item[0] + item[1] === size - 1) diagonal2++;
    return [diagonal1, diagonal2];
  }, [0,0])

  //Checking diagonal lines
  if (result.includes(size)) return  true;

}
//Opening final modal window and adding info into it
function gameOver(player, isDraw){

  const info = document.getElementById('info');
  const score = document.getElementById('scoreSpan');
  const button = document.getElementById('retryBtn');

  if (isDraw){
      info.textContent = `Nobody won`;
  }else {
      info.textContent = `Player ${player} won`;

      //Adding win count to player
      winCount[player]++
  }

  score.textContent = `${winCount.X} - ${winCount.O}`;

  button.onclick = retry;
  document.onkeydown = retry;


  //Open modal window
  modal.className = 'modalOpen';
  container.onclick = null;

}



function retry() {

  document.onkeydown = null;

  const cells = document.querySelectorAll('.cell');
    for (const cell of cells) {
        cell.innerHTML = '';
    }
  //Closing modal window
  modal.className = 'modalClosed';

  //Total score update
  totalScore.innerHTML = `${winCount.X} - ${winCount.O}`;

  //Reset default values
  player = "X";
  coords.X = [];
  coords.O = [];
  clickCount = 0;

  container.onclick = gameLogic;

}

