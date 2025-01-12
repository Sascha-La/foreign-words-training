const words = [
    { word: "apple", translation: "яблоко", example: "I eat an apple." },
    { word: "banana", translation: "банан", example: "I like banana." },
    { word: "orange", translation: "апельсин", example: "I drink orange juice." },
    { word: "grape", translation: "виноград", example: "Grapes are sweet." },
    { word: "peach", translation: "персик", example: "This is a peach." }
];

let currentIndex = 0;
let isExamMode = false;
let correctAnswers = 0;
let wrongAnswers = 0;
let timerInterval;
let startTime;

const studyMode = document.getElementById('study-mode');
const examMode = document.getElementById('exam-mode');
const currentWordElement = document.getElementById('current-word');
const totalWordElement = document.getElementById('total-word');
const wordsProgressElement = document.getElementById('words-progress');
const correctPercentElement = document.getElementById('correct-percent');
const examProgressElement = document.getElementById('exam-progress');
const timerElement = document.getElementById('time');
const resultsModal = document.querySelector('.results-modal');
const resultsContent = document.querySelector('.results-content');
const wordStatsTemplate = document.getElementById('word-stats');

document.addEventListener('DOMContentLoaded', () => {
    updateCard();
    totalWordElement.textContent = words.length;

    document.getElementById('next').addEventListener('click', () => {
        if (currentIndex < words.length - 1) {
            currentIndex++;
            updateCard();
        }
    });

    document.getElementById('back').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCard();
        }
    });

    document.getElementById('exam').addEventListener('click', startExam);
    document.getElementById('shuffle-words').addEventListener('click', shuffleWords);

    document.querySelector('.flip-card').addEventListener('click', () => {
        document.querySelector('.flip-card-inner').classList.toggle('active');
    });
});

function updateCard() {
    const cardFront = document.getElementById('card-front').querySelector('h1');
    const cardBack = document.getElementById('card-back').querySelector('h1');
    const example = document.getElementById('card-back').querySelector('span');

    cardFront.textContent = words[currentIndex].word;
    cardBack.textContent = words[currentIndex].translation;
    example.textContent = words[currentIndex].example;

    currentWordElement.textContent = currentIndex + 1;
    wordsProgressElement.value = ((currentIndex + 1) / words.length) * 100;

    document.getElementById('back').disabled = currentIndex === 0;
    document.getElementById('next').disabled = currentIndex === words.length - 1;
}

function startExam() {
    isExamMode = true;
    studyMode.classList.add('hidden');
    examMode.classList.remove('hidden');
    shuffleWords();
    startTimer();
    displayExamCards();
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function displayExamCards() {
    const examCardsContainer = document.getElementById('exam-cards');
    examCardsContainer.innerHTML = '';

    const shuffledWords = words.sort(() => Math.random() - 0.5);
    shuffledWords.forEach((wordObj) => {
        const card = document.createElement('div');
        card.classList.add('exam-card');
        card.dataset.translation = wordObj.translation;
        card.textContent = wordObj.word;
        card.addEventListener('click', handleCardClick);
        examCardsContainer.appendChild(card);
    });
}

let firstCard = null;

function handleCardClick(event) {
    const clickedCard = event.target;

    if (!firstCard) {
        firstCard = clickedCard;
        firstCard.classList.add('correct');
    } else {
        if (clickedCard === firstCard) return;

        clickedCard.classList.add('wrong');
        if (clickedCard.dataset.translation === firstCard.dataset.translation) {
            correctAnswers++;
            firstCard.classList.add('fade-out');
            clickedCard.classList.add('fade-out');
            setTimeout(() => {
                firstCard.remove();
                clickedCard.remove();
                firstCard = null;
                checkExamCompletion();
            }, 500);
        } else {
            wrongAnswers++;
            setTimeout(() => {
                clickedCard.classList.remove('wrong');
                firstCard.classList.remove('correct');
                firstCard = null;
            }, 1000);
        }
        updateExamProgress();
    }
}

function checkExamCompletion() {
    const examCards = document.querySelectorAll('.exam-card');
    if (examCards.length === 0) {
        clearInterval(timerInterval);
        showResults();
    }
}

function updateExamProgress() {
    const totalCards = words.length;
    correctPercentElement.textContent = `${Math.round((correctAnswers / totalCards) * 100)}%`;
    examProgressElement.value = (correctAnswers / totalCards) * 100;
}

function showResults() {
    resultsModal.classList.remove('hidden');
    resultsContent.innerHTML = '';
    words.forEach((wordObj) => {
        const stats = document.importNode(wordStatsTemplate.content, true);
        stats.querySelector('.word span').textContent = wordObj.word;
        stats.querySelector('.attempts span').textContent = (wordObj.word === firstCard.dataset.translation ? correctAnswers : wrongAnswers);
        resultsContent.appendChild(stats);
    });
    alert('Тестирование завершено! Поздравляем!');
}

function shuffleWords() {
    words.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    updateCard();
}