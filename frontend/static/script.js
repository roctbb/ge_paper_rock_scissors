const sdk = new GeSdk()
const path = '/games/rock_paper_scissors/static/'

let canvas;

// создаем три переменные для изображений
const images = {
    rock: new Image(),
    paper: new Image(),
    scissors: new Image(),
}

// функция для скачивания всех изображений
function loadImages() {
    return new Promise((resolve) => {
        let loaded = 0;

        const image_loaded = () => {
            loaded++;
            if (loaded === Object.keys(images).length) resolve();
        }

        Object.keys(images).forEach((image_title) => {
            images[image_title].onload = image_loaded;
            images[image_title].src = path + "/images/" + image_title + ".jpg";
        })
    })
}


function clearScreen(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayersAndScores(ctx, players, scores) {
    ctx.font = "24px serif";
    ctx.fillStyle = 'black';

    const player1_name = `Игрок 1: ${players['left']}`
    const player2_name = `Игрок 2: ${players['right']}`

    const player1_score = `Счет: ${scores['left']}`
    const player2_score = `Счет: ${scores['right']}`

    const size2 = ctx.measureText(player2_name);

    ctx.fillText(player1_name, 70, 30);
    ctx.fillText(player1_score, 70, 70);

    ctx.fillText(player2_name, canvas.width - size2.width - 70, 30);
    ctx.fillText(player2_score, canvas.width - size2.width - 70, 70);
}

function drawChoices(ctx, choices) {
    const left_image = images[choices['left']]
    const right_image = images[choices['right']]

    if (left_image) {
        ctx.drawImage(left_image, 100, 120, 200, 200);
    }

    if (right_image) {
        ctx.drawImage(right_image, canvas.width - 300, 120, 200, 200);
    }
}

function drawWinner(ctx, winner, players) {
    if (winner) {
        if (winner === 'left') {
            winner = players['left']
        } else {
            winner = players['right']
        }

        ctx.font = "48px serif";
        ctx.fillStyle = 'green';

        const text = `Победитель: ${winner}`
        const size = ctx.measureText(text);

        ctx.fillText(text, canvas.width / 2 - size.width / 2, 40);
    }
}

function init() {
    canvas = document.getElementById("field");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function newFrame(frame) {
    let ctx = canvas.getContext("2d");

    clearScreen(ctx)
    drawPlayersAndScores(ctx, frame['players'], frame['wins'])
    drawChoices(ctx, frame['choices'])
    drawWinner(ctx, frame['winner'], frame['players'])
}

init()

// запускаем игру после подгрузки изображений
loadImages().then(() => sdk.subscribe_to_frame(newFrame))
