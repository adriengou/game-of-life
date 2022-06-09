function addCells(parent, n) {
  let parentStyle = window.getComputedStyle(parent);
  let cellsPerRow = Math.sqrt(n);
  let cellsSize = parentStyle.width.replace("px", "") / cellsPerRow;

  // console.log(parentStyle.width, cellsSize);

  for (let index = 0; index < n; index++) {
    let cell = document.createElement("div");
    cell.style.width = `${cellsSize}px`;
    cell.style.height = `${cellsSize}px`;
    cell.style.border = "1px solid black";
    cell.style.boxSizing = "border-box";
    parent.appendChild(cell);
  }
}

function getCellsArray(cellsPerRow) {
  let cells = [...document.querySelectorAll(".game>div")];
  let newCells = [];

  while (cells.length) newCells.push(cells.splice(0, cellsPerRow));
  return newCells;
}

function cellToggle(cell) {
  if (cell.classList.contains("alive")) {
    cell.classList.remove("alive");
  } else {
    cell.classList.add("alive");
  }
}

function cellBirth(cellsArray, x, y) {
  cellsArray[x][y].classList.add("alive");
}

function cellKill(cellsArray, x, y) {
  cellsArray[x][y].classList.remove("alive");
}

function cellIsAlive(cellsArray, x, y) {
  let cell = cellsArray[x][y];
  if (cell.classList.contains("alive")) {
    return true;
  } else {
    return false;
  }
}

function getCellNeighboursCount(cellsArray, x, y) {
  let rowLength = cellsArray[0].length;

  let positions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  let count = 0;
  positions.forEach((pos) => {
    let neighbourX = x + pos[0];
    let neighbourY = y + pos[1];
    if (
      0 <= neighbourX &&
      neighbourX < rowLength &&
      0 <= neighbourY &&
      neighbourY < rowLength
    ) {
      if (cellIsAlive(cellsArray, neighbourX, neighbourY)) {
        count = count + 1;
      }
    }
  });

  return count;
}

function cellSurvive(cellsArray, x, y) {
  //alive with 2 or 3 neighbours
  if (
    cellIsAlive(cellsArray, x, y) &&
    (getCellNeighboursCount(cellsArray, x, y) === 2 ||
      getCellNeighboursCount(cellsArray, x, y) === 3)
  ) {
    return true;
    //dead with 3 neighbours
  } else if (
    !cellIsAlive(cellsArray, x, y) &&
    getCellNeighboursCount(cellsArray, x, y) === 3
  ) {
    return true;
  } else {
    return false;
  }
}

function nextGeneration(cellsArray) {
  let birthPos = [];
  let killPos = [];

  for (let x = 0; x < cellsArray[0].length; x++) {
    for (let y = 0; y < cellsArray[0].length; y++) {
      let cell = cellsArray[x][y];

      //cell survive to the next generation
      if (cellSurvive(cellsArray, x, y)) {
        birthPos.push([x, y]);
      }
      //cell is alive and will die
      else if (
        cellIsAlive(cellsArray, x, y) &&
        !cellSurvive(cellsArray, x, y)
      ) {
        killPos.push([x, y]);
      }
    }
  }

  birthPos.forEach((p) => {
    cellBirth(cellsArray, p[0], p[1]);
  });

  killPos.forEach((p) => {
    cellKill(cellsArray, p[0], p[1]);
  });
}

function reset(cellsArray) {
  cellsArray.forEach((row) => {
    row.forEach((cell) => {
      cell.classList.remove("alive");
    });
  });
}

function gameOfLife() {
  let playing = false;
  let gameDom = document.querySelector(".game");
  let playButtonDom = document.querySelector("#play");
  let pauseButtonDom = document.querySelector("#pause");
  let resetButtonDom = document.querySelector("#reset");
  let generationNumberDom = document.querySelector(".generation .nombre");

  let numberOfCells = 1600;
  let cellsPerRow = Math.sqrt(numberOfCells);

  addCells(gameDom, numberOfCells);

  let cellsArray = getCellsArray(cellsPerRow);

  let generation = 0;
  //controls
  gameDom.addEventListener("click", (e) => {
    if (!playing && !e.target.classList.contains("game")) {
      cellToggle(e.target);
    }
  });

  playButtonDom.addEventListener("click", () => {
    playing = true;
  });

  pauseButtonDom.addEventListener("click", () => {
    playing = false;
  });

  resetButtonDom.addEventListener("click", () => {
    playing = false;
    generation = 0;
    generationNumberDom.textContent = generation;
    reset(cellsArray);
  });

  setInterval(() => {
    if (playing) {
      nextGeneration(cellsArray);
      generation++;
      generationNumberDom.textContent = generation;
      console.log(generation);
    }
  }, 1000);
}

gameOfLife();
