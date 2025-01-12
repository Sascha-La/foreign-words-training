document.addEventListener('DOMContentLoaded', () => {
    const words = [
        { word: "apple", translation: "яблоко", example: "I eat an apple." },
        { word: "banana", translation: "банан", example: "I like banana." },
        { word: "orange", translation: "апельсин", example: "I drink orange juice." },
        { word: "grape", translation: "виноград", example: "Grapes are sweet." },
        { word: "peach", translation: "персик", example: "This is a peach." }
    ];

    let currentIndex = +localStorage.getItem('currentIndex') || 0;
    let selectedCards = [];
    let correctAnswers = 0;
    let totalAnswers = 0;
    let timerInterval;
    let startTime = localStorage.getItem('startTime') || null;

    const studyMode = document.getElementById('study-mode');
    const examMode = document.getElementById('exam-mode');
    const currentWordElement = document.getElementById('current-word');
    const totalWordsElement = document.getElementById('total-word');
    const backButton = document.getElementById('back');
    const nextButton = document.getElementById('next');
    const examButton = document.getElementById('exam');
    const flipCard = document.querySelector('.flip-card');
    const cardFront = document.getElementById('card-front').querySelector('h1');
    const cardBack = document.getElementById('card-back').querySelector('h1');
    const cardExample = document.getElementById('card-back').querySelector('span');
    const wordsProgress = document.getElementById('words-progress');
    const timerElement = document.getElementById('timer');
    const resultsModal = document.querySelector('.results-modal');
    const resultsContent = resultsModal.querySelector('.results-content');
    const wordStatsTemplate = document.getElementById('word-stats');

    function updateCard() {
        cardFront.textContent = words[currentIndex].word;
        cardBack.textContent = words[currentIndex].translation;
        cardExample.textContent = words[currentIndex].example;
        currentWordElement.textContent = currentIndex + 1;
        totalWordsElement.textContent = words.length;
        backButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === words.length - 1;
        wordsProgress.value = ((currentIndex + 1) / words.length) * 100;

        localStorage.setItem('currentIndex', currentIndex);
    }

    function flipCardHandler() {
        flipCard.classList.toggle('active');
    }

    backButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCard();
            flipCard.classList.remove('active');
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < words.length - 1) {
            currentIndex++;
            updateCard();
            flipCard.classList.remove('active');
        }
    });

    examButton.addEventListener('click', () => {
        studyMode.classList.add('hidden');
        examMode.classList.remove('hidden');
        startExam();
    });

    function startExam() {
        const examCards = [...words];
        examCards.sort(() => 0.5 - Math.random());
        const examContainer = document.getElementById('exam-cards');
        examContainer.innerHTML = '';

        examCards.forEach(({ word, translation }) => {
            const card = document.createElement('div');
            card.classList.add('exam-card');
            card.dataset.translation = translation;
            card.textContent = '??'; // Рубашка вверх
            card.addEventListener('click', selectCard);
            examContainer.appendChild(card);
        });

        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
        localStorage.setItem('startTime', startTime);
    }

    function selectCard(event) {
        const selectedCard = event.currentTarget;
        if (selectedCards.length < 2) {
            selectedCard.classList.add('active');
            selectedCards.push(selectedCard);
        }

        if (selectedCards.length === 2) {
            checkCards();
        }
    }

    function checkCards() {
        const [firstCard, secondCard] = selectedCards;

        if (firstCard.dataset.translation === secondCard.dataset.translation) {
            firstCard.classList.add('correct', 'fade-out');
            secondCard.classList.add('correct', 'fade-out');
            correctAnswers += 2; // Учитываем обе карточки
            totalAnswers += 2;
            selectedCards = [];
            if (document.querySelectorAll('.exam-card:not(.fade-out)').length === 0) {
                clearInterval(timerInterval);
                alert(`Поздравляем, вы завершили тестирование! Правильные ответы: ${correctAnswers}`);
                showResults();
            }
        } else {
            secondCard.classList.add('wrong');
            totalAnswers++;
            setTimeout(() => {
                secondCard.classList.remove('wrong');
                selectedCards = [];
            }, 500);
        }

        updateExamProgress();
    }

    function updateExamProgress() {
        const percentCorrect = (correctAnswers / totalAnswers) * 100;
        document.getElementById('correct-percent').textContent = `${percentCorrect.toFixed(0)}%`;
        document.getElementById('exam-progress').value = percentCorrect;
    }

    function showResults() {
        resultsModal.classList.remove('hidden');
        const wordStats = JSON.parse(localStorage.getItem('wordStats')) || [];

        resultsContent.innerHTML = '';
        words.forEach((wordStats, index) => {
            const clone = wordStatsTemplate.content.cloneNode(true);
            clone.querySelector('.word span').textContent = wordStats.word;
            clone.querySelector('.attempts span').textContent = wordStats.attempts;
            resultsContent.appendChild(clone);
        });
    }

    document.getElementById('shuffle-words').addEventListener('click', () => {
        words.sort(() => 0.5 - Math.random());
        currentIndex = 0;
        updateCard();
        saveShuffleState();
    });

    function saveShuffleState() {
        localStorage.setItem('shuffledWords', JSON.stringify(words));
    }

    window.onbeforeunload = () => {
        localStorage.setItem('currentIndex', currentIndex);
    };

    updateCard();
});