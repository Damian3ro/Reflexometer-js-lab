
	function showHideRules() {
		const button = document.getElementById('rules-button');
		const root = document.querySelector(':root');

		if (button.innerHTML == 'Pokaż zasady gry') {
			button.innerHTML = 'Schowaj zasady gry';
			document.getElementById('game-rules-description').style.removeProperty('display');
			root.style.setProperty('--rules-background-color', '#D9FFCB');
			root.style.setProperty('--rules-border', '1px solid black');
		} else {
			button.innerHTML = 'Pokaż zasady gry';
			document.getElementById('game-rules-description').style.display = 'none';
			root.style.setProperty('--rules-background-color', 'none');
			root.style.setProperty('--rules-border', 'none');
		}
	}

	function readValues() {
		const number = Math.floor(document.getElementById('attemptsTextField').value);

		if (number != '' && number > 0 && number <= 99){
			attempts = number;
			document.getElementById('attempts').style.display = 'none';
			document.getElementById('input-alert').style.display = 'none';
			//console.log('wartość inputu została pobrana: ' + attempts);
		} else {
			document.getElementById('input-alert').style.removeProperty('display');
		}
	}

    function showStartButton() {
		document.getElementById('start-stop-button').innerHTML = 'Start';
		document.getElementById('start-stop-button').setAttribute('class', 'start-button');
        document.querySelector(':root').style.setProperty('--background-color', '#ffffff');
		document.getElementById('attempts').style.removeProperty('display');
		colorChangeCounter = 0;
		buttonClickCounter = 0;
	}

	function showStopButton() {
		document.getElementById('start-stop-button').innerHTML = 'Stop';
	    document.getElementById('start-stop-button').setAttribute('class', 'stop-button');
	    document.getElementById('statistics-panel').style.display = 'none';
		document.getElementById('attempts').style.display = 'none';
	}

    function hexColorChange() {
        const box = document.querySelector('#game-square');
        const colorHex = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        const root = document.querySelector(':root');

		colorChangeCounter++;
        root.style.setProperty('--background-color', `${colorHex}`);
    }

	function changeGameButton() {
		if (!document.getElementById('attempts-button').onclick) {
			attempts = 5;
		}
		buttonClickCounter++;

		const delay = ms => new Promise((resolve, reject) => {
			setTimeout(function() {
				if (buttonClickCounter % 2 == 0) {
					reject();
				} else {
					resolve();
				}
			}, ms);
		});

		if (buttonClickCounter % 2 == 0) {
			showStartButton();
		} else {
			showStopButton();

			for (let i = 0; i < attempts; i++) {
				let p = Promise.resolve();
				let r = Promise.reject();

				p = p.then(() => delay((Math.random() * 10000) + 1))
					 .then(() => hexColorChange())
					 .then(() => console.log(i+1))
					 .then(() => console.log('colorChangeCounter = ' + colorChangeCounter))
					 .then(() => colorChange = true)
					 .then(() => colorChangeTime = (new Date()).getTime()/1000);
					 //console.log('Promise resolved');
					 //.then(() => console.log('colorChangeTime = ' + colorChangeTime));
				if (buttonClickCounter % 2 == 0) {
					r = r.then(() => showStartButton());
					//console.log('Promise rejected');
				}
			}
		}
	}

	function clickOnColor() {
		let quickestReactionTime = 0;
		let longestReactionTime = 0;
		let reactionTimeAverage = 0;
		let liList = document.querySelectorAll('#statistics-box ul li');

		// ------- Zliczanie kliknięć przed zmianą koloru: --------
		if (document.getElementById('start-stop-button').innerHTML == 'Stop' && colorChangeCounter != attempts) {
			gameFieldClickCounter++;
			liList[3].innerText = `Ilość kliknięć przed zmianą koloru: ${gameFieldClickCounter}`;
			//console.log('before = ' + gameFieldClickCounter);
		}
		if (colorChangeCounter == attempts) {
			gameFieldClickCounter = 0;
			showStartButton();
		}

		if (colorChange) {
		    document.getElementById('statistics-panel').style.removeProperty('display');
			let clickTime = (new Date()).getTime()/1000;
			reactionTime = clickTime - colorChangeTime;
			//console.log('reactionTime = ' + reactionTime);
			if (colorChangeCounter != attempts && colorChangeCounter > 0) {
				gameFieldClickCounter--;
				liList[3].innerText = `Ilość kliknięć przed zmianą koloru: ${gameFieldClickCounter}`;
				//console.log('during game = ' + gameFieldClickCounter);
			}

			colorChange = false;

			if (reactionTimeList.length == 0) {
				liList[0].innerText = `Najkrótszy czas reakcji: ${reactionTime.toFixed(3)} s`;
				liList[1].innerText = `Najdłuższy czas reakcji: ${reactionTime.toFixed(3)} s`;
				liList[2].innerText = `Średni czas reakcji: ${reactionTime.toFixed(3)} s`;

				reactionTimeList.push(reactionTime);
				//console.log('Pierwszy czas reakcji dodany');
				//console.log('Najkrótszy czas reakcji: ' + liList[0].innerText);
			} else {
				reactionTimeList.push(reactionTime);
				for (let i = 0; i < reactionTimeList.length; i++) {
					reactionTimesSum = reactionTimesSum + reactionTimeList[i];
				}
				reactionTimeList.sort(function(a, b) {
					return a - b;
				});
				quickestReactionTime = reactionTimeList[0];
				longestReactionTime = reactionTimeList[reactionTimeList.length-1];
				reactionTimeAverage = (reactionTimesSum/(reactionTimeList.length));
				//console.log('reactionTimesSum = ' + reactionTimesSum);
				//console.log('reactionTimeAverage = ' + reactionTimeAverage);

				liList[0].innerText = `Najkrótszy czas reakcji: ${quickestReactionTime.toFixed(3)} s`;
				liList[1].innerText = `Najdłuższy czas reakcji: ${longestReactionTime.toFixed(3)} s`;
				liList[2].innerText = `Średni czas reakcji: ${reactionTimeAverage.toFixed(3)} s`;

				//console.log('Najkrótszy czas reakcji: ' + liList[0].innerText);

				// -------- Pamiętanie i wyświetlanie w wynikach najlepszego wyniku: --------
				if (reactionTimeList.length == attempts) {
					reactionTimeList.splice(1, reactionTimeList.length);
					reactionTimesSum = reactionTimeAverage;
				}
			}
		}
	}