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

/*
Non so se è la soluzione più ottimale, ma almeno ora funziona
*/

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
const solution = 'SARA';

// funzione di verifica
const wordChecker = function (word, solution) {
    let success = [];
    let result = [];


    // ATTENZIONE ALLE PAROLE maiuscole/minuscole.
    word = word.toLowerCase();
    solution = solution.toLowerCase();

    // controllo lettera per lettera in parola
    for (let index in word) {
        // VERDE: la lettera è contenuta nella parola nella posizione giusta
        // GIALLO: la lettera è contenuta nella parola ma NON nella posizione giusta
        // GRIGIO: la lettera non è contenuta nella parola

        let letter = word.charAt(index)
        let trueLetter = solution.charAt(index)
        let count=0;
        for(let j=0;j<wordGameLength;j++)
            if(letter.includes(solution[j]) && j!=index)
                count++
        if(letter===trueLetter){
            result.push(chalk.green(letter.toUpperCase()))
            success.push(true);
        }
        else if(count!=0)
            result.push(chalk.yellow(letter.toUpperCase()))
        else    
            result.push(chalk.grey(letter.toUpperCase()))
        
    }
    //Con questo console.log funziona, ma non capisco bene perchè col return non va.
    //Non capisco bene perchè ciò succeda
    console.log(result.join(' '))

    // ritorno un risultato composto dalle lettere colorate e da un success booleano
    // per fare uscire dal gioco se l'utente indovina la parola
    
    return {
        'success': success.length===word.length
    }
}

// funzione di Gioco
const game = function (attempt, max) {
    // https://nodejs.org/api/readline.html#rlquestionquery-options-callback
    rl.question(chalk.blue(`Inserisci una parola di ${wordGameLength} caratteri: `), function (answer) {


    console.log('\n', `Tentativo ${attempt+1} di ${max}`);
    ++attempt;
        
        // usiamo una safe word per uscire dal ciclo
        if (answer === 'exit') {
            return rl.close();
        }
        
    let result =  wordChecker(answer, solution) 
        // controlla di aver inserito esattamente wordGameLength caratteri altrimenti dai un errore
        if (answer.length<wordGameLength || answer.length>wordGameLength) {
            console.log('\n', chalk.red(`Devi inserire ${wordGameLength} caratteri.`));
        }
        else
            console.log(result)

    

        if (result.success) {
            console.log(chalk.green(' >> HAI VINTO << '));
            return rl.close();
        }

        if (attempt>5) {
            console.log('\n', chalk.red(`Spiacente, hai terminato i ${attempt} tentativi. La soluzione era ${chalk.green.underline(solution)}`), '\n');
            return rl.close();
        }

        // Richiamo la funzione fino a esaurimento dei tentativi
        game(attempt, maxGameAttempt);
    });
}

game(attempt, maxGameAttempt);



