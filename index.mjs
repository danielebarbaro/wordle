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
import 'dotenv/config';

let attempt = 0;
let maxGameAttempt;
let wordGameLength;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(chalk.gray(question), (answer) => resolve(parseInt(answer.trim()))));
};

const randomWord = async function (wordLength, wordGameLength = 4) {
    const url = `https://random-words5.p.rapidapi.com/getMultipleRandom?count=10&minLength=${wordLength}&maxLength=${wordLength}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': process.env.APIHOST,
                'X-RapidAPI-Key': process.env.APIKEY
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.filter(word => word.length === wordGameLength).shift();
    } catch (error) {
        console.error('ERRORE:', error.message);
    }
}

const wordChecker = function (word, solution) {
    let success = [];
    let result = [];
    let solutionWordCounter = wordCounter(solution);

    solution = solution.toLowerCase();
    word = word.toLowerCase();

    for (let index in word) {
        let wordLetter = word[index];
        let solutionLetter = solution[index];
        if (solutionWordCounter[wordLetter] > 0) {
            if (wordLetter === solutionLetter) {
                result.push(chalk.green(wordLetter.toUpperCase()));
                success.push(true);
            } else {
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

const wordCounter = function (word) {
    let dictionary = {};
    for (let letter of word) {
        dictionary[letter] ? dictionary[letter]++ : dictionary[letter] = 1;
    }
    return dictionary;
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

const start = async () => {
    maxGameAttempt = await askQuestion('Quanti tentativi vuoi fare? (default 6) ') || 6;
    wordGameLength = await askQuestion('Quanto deve essere lunga la parola? (default 4) ') || 4;

    console.log(`\nSto generando una parola casuale di ${wordGameLength} lettere da risolvere in ${maxGameAttempt} tentativi...\n`);
    let solution = await randomWord(wordGameLength, wordGameLength);
    console.log(chalk.green('La parola è stata generata! Buona fortuna! \n'));

    game(attempt, maxGameAttempt, solution);
};

await start();
