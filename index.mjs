/**
 * Implementare WORDLE. [https://www.nytimes.com/games/wordle/index.html]
 *   Ogni tentativo deve avere 4 lettere valide.
 *
 *   Il colore della lettera deve cambiare secondo le seguenti regole:
 *
 *   VERDE: la lettera è contenuta nella soluzione nella posizione giusta
 *   GIALLO: la lettera è contenuta nella soluzione ma NON nella posizione giusta
 *   GRIGIO: la lettera non è contenuta nella soluzione
 *
 * */

import chalk from 'chalk';
import readline from 'readline';
import axios from 'axios';
import 'dotenv/config';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(chalk.blue(question), (answer) => resolve(answer.trim())));
};

let attempt = 0;
let maxGameAttempt;
let wordGameLength;

const randomWord = function (wordLength) {
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: {count: '5', minLength: wordLength, maxLength: wordLength},
        headers: {
            'X-RapidAPI-Host': process.env.APIHOST,
            'X-RapidAPI-Key': process.env.APIKEY
        }
    };

    return axios
        .request(options)
        .then(function (response) {
            // console.log('risultato', response.data);
            // console.log('risultato filtrato solo parole = 4', response.data.filter(word => word.length === wordGameLength));
            // console.log('parola da indovinare', response.data.filter(word => word.length === wordGameLength).shift())
            return response.data.filter(word => word.length === wordGameLength).shift();
        })
        .catch(function (error) {
            console.error('ERRORE: ', error.response.data.message);
        });
}

const wordChecker = function (word, solution) {
    let success = [];
    let result = [];
    word = word.toLowerCase();
    solution = solution.toLowerCase();
    let solutionWordCounter = wordCounter(solution);

    for (let index = 0; index < word.length; index++) {
        let wordLetter = word.charAt(index);
        let solutionLetter = solution.charAt(index);

        if (solutionWordCounter[wordLetter] > 0) {
            if (wordLetter === solutionLetter) {
                result.push(chalk.green(wordLetter.toUpperCase()));
                success.push(true);
            } else if (solution.indexOf(wordLetter) !== -1 && solutionWordCounter[wordLetter] > 0) {
                result.push(chalk.yellow(wordLetter.toUpperCase()));
            }
            solutionWordCounter[wordLetter]--;
        } else {
            result.push(chalk.gray(wordLetter.toUpperCase()));
        }
    }

    return {
        'data': result.join(' '),
        'success': success.length === word.length
    };
};

const wordCounter = function (str) {
    let res = {};
    for (let s of str) {
        res[s] ? res[s]++ : res[s] = 1;
    }
    return res;
};

const game = function (attempt, max, solution) {
    rl.question(chalk.blue(`Inserisci una parola di ${wordGameLength} caratteri: `), function (answer) {
        if (answer === 'exit') return rl.close();
        if (answer.length !== wordGameLength) {
            console.log(chalk.red(`Devi inserire ${wordGameLength} caratteri.`));
            return game(attempt, max, solution);
        }

        attempt++;
        console.log(`\nTentativo ${attempt} di ${max}`);
        let result = wordChecker(answer, solution);
        console.log('\t', result.data);

        if (result.success) {
            console.log(chalk.green(' >> HAI VINTO << '));
            return rl.close();
        }

        if (attempt === max) {
            console.log(chalk.red(`Spiacente, hai terminato i ${attempt} tentativi. La soluzione era ${solution}`), '\n');
            return rl.close();
        }

        game(attempt, max, solution);
    });
};

const initGame = async () => {
    maxGameAttempt = parseInt(await askQuestion('Quanti tentativi vuoi fare? (default 6) ')) || 6;
    wordGameLength = parseInt(await askQuestion('Quanto deve essere lunga la parola? (default 4) ')) || 4;

    console.log(`\nGenerando una parola casuale di ${wordGameLength} lettere...\n`);
    let solution = await randomWord(wordGameLength);
    console.log(chalk.green('La parola è stata generata! Buona fortuna! \n'));

    game(attempt, maxGameAttempt, solution);
};

initGame();
