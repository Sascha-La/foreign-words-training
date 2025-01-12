document.addEventListener('DOMContentLoaded', () => {
    const words = [
        { word: "apple", translation: "яблоко", example: "I eat an apple." },
        { word: "banana", translation: "банан", example: "I like banana." },
        { word: "orange", translation: "апельсин", example: "I drink orange juice." },
        { word: "grape", translation: "виноград", example: "Grapes are sweet." },
        { word: "peach", translation: "персик", example: "This is a peach." },
    ];

    let currentIndex = 0;
    let selectedCards = [];

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

    function updateCard() {
        cardFront.textContent = words[currentIndex].word;
        cardBack.textContent = words[currentIndex].translation;
        cardExample.textContent = words[currentIndex].example;
        currentWordElement.textContent = currentIndex + 1;
        totalWordsElement.textContent = words.length;
        backButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === words.length - 1;
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
        examCards.sort(() => 0.5 - Math.random());
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
            selectedCards = [];
            if (document.querySelectorAll('.exam-card:not(.fade-out)').length === 0) {
                alert('Поздравляем, вы завершили тестирование!');
            }
        } else {
            secondCard.classList.add('wrong');
            setTimeout(() => {
                secondCard.classList.remove('wrong');
                selectedCards = [];
            }, 500);
        }
    }

    updateCard();
});