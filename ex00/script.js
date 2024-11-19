var	board;
var	score = 0;
var	rows = 4;
var	columns = 4;

window.onload = function()
{
	setGame();
}

function	setGame()
{
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]

	for (let y = 0; y < rows; y++)
	{
		for (let x = 0; x < columns; x++)
		{
			let	tile = document.createElement("div");
			tile.id = y.toString() + "-" + x.toString();
			let num = board[y][x];
			updateTile(tile, num);
			document.getElementById("game_board").append(tile);
		}
	}
	addTwo();
	addTwo();
}

function	hasEmptyTile()
{
	for (let y = 0; y < rows; y++)
	{
		for (let x = 0; x < columns; x++)
		{
			if (board[y][x] == 0)
				return (true);
		}
	}
	return (false);
}

function	addTwo()
{
	if (!hasEmptyTile())
		return ;

	let	found = false;
	while (!found)
	{
		let	y = Math.floor(Math.random() * rows);
		let	x = Math.floor(Math.random() * columns);
		if (board[y][x] == 0)
		{
			board[y][x] = 2;
			let tile = document.getElementById(y.toString() + "-" + x.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

function	updateTile(tile, num)
{
	tile.innerText = "";
	tile.classList.value = "";
	tile.classList.add("tile");
	if (num > 0)
	{
		tile.innerText = num;
		if (num <= 4096)
			tile.classList.add("x" + num.toString());
		else
			tile.classList.add("x8192");
	}
}

function showOverlay(message)
{
	document.getElementById("overlay-message").innerText = message;
	document.getElementById("overlay").style.display = "flex";
	document.getElementById("game_board").classList.add("faded");
}

function restartGame()
{
	location.reload();
}

document.addEventListener("keyup", (e) => {
	if (!canMove())
		return (showOverlay("GAME OVER"));
	else if (winCheck())
		return (showOverlay("WELL DONE!"));
	if (e.code == "ArrowLeft")
	{
		if (moveLeft() && hasEmptyTile())
			addTwo();
	}
	else if (e.code == "ArrowRight")
	{
		if (moveRight() && hasEmptyTile())
			addTwo();
	}
	else if (e.code == "ArrowUp")
	{
		if (moveUp() && hasEmptyTile())
			addTwo();
	}
	else if (e.code == "ArrowDown")
	{
		if (moveDown() && hasEmptyTile())
			addTwo();
	}
	document.getElementById("score").innerText = score;
})

function	removeZeros(row)
{
	return (row.filter(num => num != 0));
}

function	slide(row)
{
	row = removeZeros(row);
	for (let i = 0; i < row.length - 1; i++)
	{
		if (row[i] == row[i + 1])
		{
			row[i] *= 2;
			row[i + 1] = 0;
			score += row[i];
		}
	}
	row = removeZeros(row);
	while (row.length < columns)
		row.push(0);
	return (row);
}
function	moveLeft()
{
	let originalBoard = board.map(row => row.slice());
	for (let y = 0; y < rows; y++)
	{
		let row = board[y];
		row = slide(row);
		board[y] = row;
		for (let x = 0; x < columns; x++)
		{
			let tile = document.getElementById(y.toString() + "-" + x.toString());
			let num = board[y][x];
			updateTile(tile, num);
		}
	}
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++)
		{
			if (board[y][x] !== originalBoard[y][x])
				return (true);
		}
	}
	return (false);
}

function	moveRight()
{
	let originalBoard = board.map(row => row.slice());
	for (let y = 0; y < rows; y++)
	{
		let row = board[y];
		row.reverse();
		row = slide(row);
		row.reverse();
		board[y] = row;
		for (let x = 0; x < columns; x++)
		{
			let tile = document.getElementById(y.toString() + "-" + x.toString());
			let num = board[y][x];
			updateTile(tile, num);
		}
	}
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++)
		{
			if (board[y][x] !== originalBoard[y][x])
				return (true);
		}
	}
	return (false);
}

function	moveUp()
{
	let originalBoard = board.map(row => row.slice());
	for (let x = 0; x < columns; x++)
	{
		let	auxRow = [board[0][x], board[1][x], board[2][x], board[3][x]];
		auxRow = slide(auxRow);
		for (let y = 0; y < rows; y++)
		{
			board[y][x] = auxRow[y];
			let tile = document.getElementById(y.toString() + "-" + x.toString());
			let num = board[y][x];
			updateTile(tile, num);
		}
	}
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++)
		{
			if (board[y][x] !== originalBoard[y][x])
				return (true);
		}
	}
	return (false);
}

function	moveDown()
{
	let originalBoard = board.map(row => row.slice());
	for (let x = 0; x < columns; x++)
	{
		let	auxRow = [board[0][x], board[1][x], board[2][x], board[3][x]];
		auxRow.reverse();
		auxRow = slide(auxRow);
		auxRow.reverse();
		for (let y = 0; y < rows; y++)
		{
			board[y][x] = auxRow[y];
			let tile = document.getElementById(y.toString() + "-" + x.toString());
			let num = board[y][x];
			updateTile(tile, num);
		}
	}
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++)
		{
			if (board[y][x] !== originalBoard[y][x])
				return (true);
		}
	}
	return (false);
}

function	canMove(row)
{
	if (hasEmptyTile())
		return(true);
	for (let y = 0; y < rows; y++)
	{
		for (let x = 0; x < columns - 1; x++)
		{
			if (board[y][x] === board[y][x + 1])
				return (true);
		}
	}
	for (let x = 0; x < columns; x++)
	{
		for (let y = 0; y < rows - 1; y++)
		{
			if (board[y][x] === board[y + 1][x])
				return (true);
		}
	}
	return (false);
}

function	winCheck()
{
	for (let y = 0; y < rows; y++)
	{
		for (let x = 0; x < columns - 1; x++)
		{
			if (board[y][x] === 2048)
				return (true);
		}
	}
	return (false);
}
