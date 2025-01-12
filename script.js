document.addEventListener('DOMContentLoaded', () => {
    const words = [
        { word: 'Conjecture', translation: 'Догадка, гипотеза', example: 'There is been a lot of conjecture in the media recently about the marriage.' },
        { word: 'Existence', translation: 'Существование, наличие', example: 'It is a natural part of our existence - everyone needs love.' },
        { word: 'Assertion', translation: 'Утверждение, заявление', example: 'Armed aggression continues to impede indigenous peoples assertion of their rights against mining companies..' },
        { word: 'Vindication', translation: 'Доказательство', example: 'Receiving the award felt like vindication after years of hard work and skepticism.' },
        { word: 'Ambiguity', translation: 'Двусмысленность, неоднозначност', example: 'Ambiguity is often deliberately used in politics.' },
    ];

    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
    let correctAnswers = 0;
    let totalAnswers = 0;

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

    let timerInterval;
    let startTime;

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

    flipCard.addEventListener('click', () => {
        flipCard.classList.toggle('active');
    });

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
        examCards.sort(() => Math.random() - 0.5);
        const examContainer = document.getElementById('exam-cards');
        examContainer.innerHTML = '';

        examCards.forEach(({ word, translation }) => {
            const card = document.createElement('div');
            card.classList.add('exam-card');
            card.dataset.translation = translation;
            card.textContent = '??';
            card.addEventListener('click', selectCard);
            examContainer.appendChild(card);
        });

        correctAnswers = 0;
        totalAnswers = 0;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }

    let selectedCards = [];

    function selectCard(event) {
        const selectedCard = event.currentTarget;
        if (selectedCards.length < 2) {
            selectedCards.push(selectedCard);
            selectedCard.classList.add('active');
        }

        if (selectedCards.length === 2) {
            checkCards();
        }
    }

    function checkCards() {
        const [firstCard, secondCard] = selectedCards;

        totalAnswers++;
        if (firstCard.dataset.translation === secondCard.dataset.translation) {
            firstCard.classList.add('correct', 'fade-out');
            secondCard.classList.add('correct', 'fade-out');
            correctAnswers += 2;

            if (document.querySelectorAll('.exam-card:not(.fade-out)').length === 0) {
                clearInterval(timerInterval);
                alert('Поздравляем, вы завершили тестирование! Правильные ответы: ' + correctAnswers);
                showResults();
            }
        } else {
            secondCard.classList.add('wrong');
            setTimeout(() => {
                secondCard.classList.remove('wrong');
            }, 500);
        }

        selectedCards = [];
        updateExamProgress();
    }

    function updateExamProgress() {
        const percentCorrect = (correctAnswers / totalAnswers) * 100;
        document.getElementById('correct-percent').textContent = `${percentCorrect.toFixed(0)}%`;
        document.getElementById('exam-progress').value = percentCorrect;
    }

    function showResults() {
        resultsModal.classList.remove('hidden');
        resultsContent.innerHTML = '';

        words.forEach((wordStat, index) => {
            const clone = wordStatsTemplate.content.cloneNode(true);
            clone.querySelector('.word span').textContent = wordStat.word;
            clone.querySelector('.attempts span').textContent = resultsContent.appendChild(clone);
        });
    }

    document.getElementById('shuffle-words').addEventListener('click', () => {
        words.sort(() => Math.random() - 0.5);
        currentIndex = 0;
        updateCard();
        localStorage.setItem('shuffledWords', JSON.stringify(words));
    });

    window.onbeforeunload = () => {
        localStorage.setItem('currentIndex', currentIndex);
    };

    updateCard();
});