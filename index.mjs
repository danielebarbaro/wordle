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

// https://nodejs.org/api/readline.html#readlinecreateinterfaceoptions
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

let attempt = 0 // contatore dei tentativi
let maxGameAttempt = 6; // abbiamo 6 tentativi per risolvere una parola
let wordGameLength = 4; // la parola deve esser lunga al max 4

// Soluzione statica a fine didattico.
const solution = 'code';

// funzione di verifica
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
            solutionWordCounter[wordLetter]--
        } else {
            result.push(chalk.gray(wordLetter.toUpperCase()));
        }
    }

    return {
        'data': result.join(' '),
        'success': success.length === word.length
    }
}

const wordCounter = function (str) {
    let res = [];
    for (let s of str) {
        res[s] ? res[s]++ : res[s] = 1;
    }
    return res;
}

// funzione di Gioco
const game = function (attempt, max) {
    // https://nodejs.org/api/readline.html#rlquestionquery-options-callback
    rl.question(chalk.blue(`Inserisci una parola di ${wordGameLength} caratteri: `), function (answer) {

        // usiamo una safe word per uscire dal ciclo
        if (answer === 'exit') {
            return rl.close();
        }

        // controlla di aver inserito esattamente wordGameLength caratteri altrimenti dai un errore
        if (answer.length !== wordGameLength) {
            console.log('\n', chalk.red(`Devi inserire ${wordGameLength} caratteri.`));
            game(attempt, maxGameAttempt);
        } else {
            ++attempt;
            console.log('\n', `Tentativo ${attempt} di ${max}`);
            let result = wordChecker(answer, solution);
            console.log('\t', result.data);

            if (result.success) {
                console.log(chalk.green(' >> HAI VINTO << '));
                return rl.close();
            }
        }


        if (attempt === max) {
            console.log('\n', chalk.red(`Spiacente hai terminato i ${attempt} tentativi. La soluzione era ${solution}`), '\n');
            return rl.close();
        }

        // Richiamo la funzione fino a esaurimento dei tentativi
        game(attempt, maxGameAttempt);
    });
}

game(attempt, maxGameAttempt);





