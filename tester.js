const cardContainer = document.querySelector('.card-container');
let startX = 0, startY = 0, currentX = 0, currentY = 0;
let isDragging = false;
let selectedPlayers = null;
let currentBlackCard = null;
let currentPlayerIndex = 0;
let totalPlayers = 0;
let selectedAnswers = [];
let currentQuestion = null; // Global variable to store the current question
let isRoundOver = false;
const mainImageCard = document.querySelector('.imagecard');
const innerFlipCard = document.querySelector('.imagecard-inner');
let playerHands = []; // Array to store each player's hand of answer cards
const cardsPerPlayer = 8; // Number of cards each player starts with

// Log initialization
console.log("Game variables initialized.");

// Main image card interaction
mainImageCard.addEventListener('click', (event) => {
  event.stopPropagation();
  console.log("Main image card clicked.");
  if (mainImageCard.classList.contains('flipped')) {
    console.log("Main image card is flipped, hiding.");
    mainImageCard.classList.add('hidden');
  } else {
    console.log("Flipping main image card.");
    mainImageCard.classList.toggle('flipped');
  }
});

// Swipe functionality
const interactiveCard = document.getElementById('imageCard');
let touchStartX, touchStartY, offsetX, offsetY;

interactiveCard.addEventListener('mousedown', startInteraction);
interactiveCard.addEventListener('touchstart', startInteraction);

interactiveCard.addEventListener('mousemove', handleInteraction);
interactiveCard.addEventListener('touchmove', handleInteraction);

interactiveCard.addEventListener('mouseup', endInteraction);
interactiveCard.addEventListener('touchend', endInteraction);

function startInteraction(event) {
  const touchPoint = event.type.includes('touch') ? event.touches[0] : event;
  touchStartX = touchPoint.clientX;
  touchStartY = touchPoint.clientY;
  console.log('Interaction started:', { touchStartX, touchStartY });
}

function handleInteraction(event) {
  if (touchStartX === undefined || touchStartY === undefined) return;
  const touchPoint = event.type.includes('touch') ? event.touches[0] : event;
  offsetX = touchPoint.clientX - touchStartX;
  offsetY = touchPoint.clientY - touchStartY;
  interactiveCard.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.1}deg)`;

}

function endInteraction() {
  console.log('Interaction ended:', { offsetX, offsetY });
  if (offsetX > 100) {
    console.log('Swipe direction: right');
    performCardAction('right');
  } else if (offsetX < -100) {
    console.log('Swipe direction: left');
    performCardAction('left');
  } else if (offsetY < -100) {
    console.log('Swipe direction: up');
    performCardAction('up');
  } else {
    console.log('Swipe cancelled.');
    interactiveCard.style.transform = '';
  }
  touchStartX = undefined;
  touchStartY = undefined;
}

function performCardAction(direction) {
  console.log(`Performing card action: ${direction}`);
  switch (direction) {
    case 'right':
      interactiveCard.style.transform = `translate(100vw, ${offsetY}px)`;
      break;
    case 'left':
      interactiveCard.style.transform = `translate(-100vw, ${offsetY}px)`;
      break;
    case 'up':
      interactiveCard.style.transform = `translate(${offsetX}px, -100vh)`;
      break;
  }
  interactiveCard.style.opacity = 0;
  setTimeout(() => {
    console.log(`Card action (${direction}) completed.`);
    interactiveCard.classList.add('hidden');
  }, 300);
}

// Questions and answers
const questions = [
    "I got kicked out of the club because I _____",
    "The worst decision I made after midnight was _____",
    "I can't believe I got away with _____",
    "The best excuse I used to get out of sex was _____",
    "Nothing says 'I'm over you' like _____",
    "I was way too drunk when I decided to _____",
    "The most awkward thing I ever brought to bed was _____",
    "I ruined a family dinner by talking about _____",
    "They dumped me because I couldn't stop _____",
    "I tried to turn them on by _____",
    "The worst thing to say during sex is _____",
    "I got my weirdest kink from _____",
    "The strangest place I've had sex was _____",
    "I really shouldn't have Googled _____",
    "My weirdest fetish is probably _____",
    "I embarrassed myself in front of everyone by _____",
    "I can never go back to that bar because of _____",
    "The most awkward hookup involved _____",
    "The craziest roleplay idea I ever had was _____",
    "I tried to make a good impression, but then I _____",
    "The weirdest thing someone ever asked me to do during sex was _____",
    "I freaked them out when I said _____",
    "The most awkward moment in bed happened when I _____",
    "I can't believe I said yes to _____",
    "The strangest thing that turns me on is _____",
    "The most desperate thing I've done for attention was _____",
    "My worst one-night stand ended with _____",
    "The biggest lie I've ever told to get laid was _____",
    "I made it weird by talking about _____",
    "The most inappropriate place I've hooked up was _____",
    "I got turned on by _____ and now I can't unsee it",
    "The most embarrassing secret I have is _____",
    "I lost a bet and had to _____",
    "The weirdest roleplay I participated in involved _____",
    "I scared them off by admitting I like _____",
    "The dumbest way I hurt myself was by _____",
    "The most awkward thing I've screamed during sex is _____",
    "I should've known it was over when they _____",
    "I had to sneak out because I woke up next to _____",
    "The weirdest compliment I've received was about _____",
    "I accidentally walked in on _____ and couldn't stop staring",
    "I ghosted someone because they wouldn't stop _____",
    "The most inappropriate thing I bought online was _____",
    "I shouldn't have laughed at _____, but I did",
    "The most ridiculous thing that turned me on was _____",
    "The craziest thing I've said to avoid getting caught was _____",
    "I got banned from Tinder because I _____",
    "I ended a relationship because they were obsessed with _____",
    "I made things awkward when I said _____ at the wrong time",
    "I accidentally showed my weird collection of _____ to the wrong person",
    "The most embarrassing thing I've shouted in public was _____",
    "The worst excuse I've used to leave a date was _____",
    "The most inappropriate thing I’ve said during Truth or Dare was _____",
    "The weirdest noise I've made during sex was _____",
    "I tried to spice things up by bringing _____ into the bedroom",
    "I wish I hadn’t trusted _____",
    "The strangest thing I’ve said to a stranger was _____",
    "The creepiest thing I did to get attention was _____",
    "I shouldn’t have worn _____ to the office",
    "I got dumped because I couldn’t stop talking about _____",
    "The worst text I sent to my ex was about _____",
    "I was banned from a friend's house for _____",
    "The weirdest way I've flirted was by talking about _____",
    "My kinkiest secret is _____",
    "The most dangerous thing I've done out of jealousy was _____"
];


const answers = [
    "accidentally sexting my boss",
    "getting banned from a petting zoo",
    "a questionable tattoo of my ex's name",
    "hitting on my therapist",
    "forgetting my safe word",
    "getting caught roleplaying as a sexy firefighter",
    "an awkward morning-after breakfast with their parents",
    "having a meltdown over a missing sock",
    "trying to flirt while blackout drunk",
    "convincing myself I was a witch",
    "a one-night stand with unexpected feelings",
    "public urination with style",
    "uncomfortable eye contact during a threesome",
    "accidentally sending nudes to the family group chat",
    "dancing topless on a bar for free drinks",
    "having an emotional breakdown over bad pizza",
    "crying in a McDonald's at 3 AM",
    "thinking a stranger was my partner in bed",
    "discovering I’m allergic to latex... too late",
    "stealing flowers from a cemetery for a date",
    "oversharing during a first date",
    "getting too turned on by a cartoon character",
    "breaking a bed while trying something new",
    "trying to be sexy but looking like a baby giraffe",
    "forgetting where I put my underwear",
    "thinking it was lube but it was hot sauce",
    "taking the wrong drugs before a wedding",
    "ghosting someone because they smelled like cabbage",
    "falling in love with my Uber driver",
    "not understanding why everyone else is clothed",
    "getting dumped for sending too many memes",
    "accidentally liking their ex's vacation photos",
    "faking a heart attack to get out of a bad date",
    "complimenting someone's pregnancy when they weren’t pregnant",
    "joining a cult because I was bored",
    "my collection of toenail clippings",
    "kissing the wrong twin",
    "getting high and thinking I was a table",
    "an accidental foot fetish reveal",
    "hiding in the closet while their spouse came home",
    "a suspicious stain on my favorite couch",
    "streaking during a charity event",
    "throwing up in a stranger's lap on a plane",
    "wearing my partner's underwear to work",
    "screaming during sex because I saw a spider",
    "laughing at a funeral",
    "thinking my cat was a reincarnated relative",
    "doing body shots with my boss",
    "forgetting how sex works mid-hookup",
    "my weird obsession with scented candles",
    "pretending I was a stripper to avoid small talk",
    "a very suspicious Google search history",
    "being banned from Tinder for inappropriate behavior",
    "misreading the vibes and going in for a kiss",
    "an awkward accidental confession during a game of Truth or Dare",
    "stealing someone's dessert and blaming a ghost",
    "being way too into handcuffs",
    "a really bad choice of costume for a kid's birthday party",
    "slipping into an accent that doesn't exist",
    "an unfortunate encounter with edible body paint",
    "a thong in the wrong size",
    "forgetting that deodorant is important",
    "a very public rejection",
    "oversharing in a job interview",
    "trying to breakdance at a wedding and breaking a hip"
];



function dealCardsToPlayers() {
    playerHands = []; // Reset player hands

    for (let i = 0; i < totalPlayers; i++) {
        const hand = [];
        for (let j = 0; j < cardsPerPlayer; j++) {
            if (answers.length > 0) {
                const randomIndex = Math.floor(Math.random() * answers.length);
                const card = answers.splice(randomIndex, 1)[0]; // Draw a card
                hand.push(card);
            } else {
                console.warn(`Not enough cards available to deal to Player ${i + 1}`);
            }
        }
        playerHands.push(hand);
    }

    console.log("Dealt cards to players:", playerHands);
}

  
// Logging questions and answers for reference
console.log("Available questions:", questions);
console.log("Available answers:", answers);

// Drag functionality
function handleDragStart(event) {
  startX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
  startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
  isDragging = true;
  console.log('Drag started:', { startX, startY });

}

function handleDragMove(event) {
  if (!isDragging) return;
  currentX = (event.type === 'mousemove' ? event.clientX : event.touches[0].clientX) - startX;
  currentY = (event.type === 'mousemove' ? event.clientY : event.touches[0].clientY) - startY;
  const activeCard = cardContainer.children[0];
  activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentX / 10}deg)`;

  
}

function handleDragEnd() {
  if (!isDragging) return;
  isDragging = false;

  const activeCard = cardContainer.children[0];
  const isCardMasterPhase = cardContainer.classList.contains('card-master-phase');

  console.log('Drag ended:', { currentX, currentY, isCardMasterPhase });

  if (activeCard.classList.contains('black-card') && currentY < -100) {
    console.log('Swipe-up disabled for black card.');
    activeCard.style.transform = 'translate(0, 0) rotate(0deg)';
  } else if (isCardMasterPhase && activeCard.classList.contains('answer-card') && currentY < -100) {
    console.log('Card Master selected an answer.');
    determineWinner(activeCard);
  } else if (currentY < -100 && selectedPlayers === null) {
    console.log('Storing selected players.');
    storePlayers(activeCard);
  } else if (currentY < -100 && selectedPlayers !== null) {
    console.log('Handling answer selection.');
    handleAnswerSelection(activeCard);
  } else if (currentX > 100 || currentX < -100) {
    console.log(`Cycling card: ${currentX > 0 ? 'right' : 'left'}`);
    cycleCard(currentX > 0 ? 'right' : 'left');
  } else {
    activeCard.style.transform = 'translate(0, 0) rotate(0deg)';
  }

  currentX = 0;
  currentY = 0;
}
function endRound() {
    isRoundOver = true;
    console.log("The round is now over.");
  }
  
  function cycleCard() {
    const activeCard = cardContainer.children[0]; // Get the top card
  
    // Check if the round has ended and the top card is the black card
    if (isRoundOver && activeCard.classList.contains('black-card')) {
      console.log('Round ended: Removing the black question card instead of cycling it.');
      cardContainer.removeChild(activeCard);
  
      // Create a new black card for the next round
      createBlackCard();
  
      // Reset the round state
      isRoundOver = false;
      return; // Stop further cycling logic since we've handled the black card removal
    }
  
    // Normal cycling logic if the round has not ended
    console.log('Cycling card:', activeCard.textContent);
    activeCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    activeCard.style.transform = 'rotateX(180deg) translateZ(-10px)';
    activeCard.style.zIndex = -1; // Move card behind other elements
  
    setTimeout(() => {
      console.log('Resetting card position and moving to the back.');
      activeCard.style.transition = 'none';
      activeCard.style.transform = 'translateZ(-30px)';
      activeCard.style.zIndex = ''; // Reset z-index
      cardContainer.appendChild(activeCard); // Move card to the end
  
      // Update stacking for remaining cards
      const cards = cardContainer.children;
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = `translateZ(${-i * 10}px)`;
      }
      console.log('Card cycling completed.');
    }, 500); // Match the duration of the flip animation
    console.log("Available questions:", questions);
console.log("Available answers:", answers);
  }
  
  
  
  // Example usage: Flip cards on click
  document.addEventListener('click', () => {
    cycleCard();
  });

// Store the number of players
function storePlayers(card) {
    const players = parseInt(card.textContent.match(/\d+/)[0], 10);
    selectedPlayers = players;
    totalPlayers = players;

    console.log(`Stored number of players: ${selectedPlayers}`);
    cardContainer.removeChild(card);

    // Deal cards to players after determining the number of players
    dealCardsToPlayers();

    // Now create the black card
    createBlackCard();
}


// Create a black card with a persistent question
function createBlackCard() {
    if (!currentQuestion) {
      currentQuestion = getRandomQuestion();
    }
  
    console.log('Creating black card with question:', currentQuestion);
  
    // Remove the existing black card if present
    if (currentBlackCard) {
      currentBlackCard.remove();
    }
  
    // Create the new black card
    const blackCard = document.createElement('div');
    blackCard.classList.add('card', 'black-card');
    blackCard.style.backgroundColor = 'black';
    blackCard.style.color = 'white';

  
    // Create the paragraph for the player's turn
    const playerParagraph = document.createElement('p');
    playerParagraph.textContent = `Player ${currentPlayerIndex + 1}'s turn`;

  
    // Create the paragraph for the question
    const questionParagraph = document.createElement('p');
    questionParagraph.textContent = currentQuestion;
  
    // Append paragraphs to the black card
    blackCard.appendChild(playerParagraph);
    blackCard.appendChild(questionParagraph);
  
    // Add the black card to the container
    cardContainer.prepend(blackCard);
    currentBlackCard = blackCard;
  
    // Update and rearrange other elements
    updateAnswerCards();
    rearrangeCards();
  }
  



// Get a random question (only used when currentQuestion is null)
function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    console.log('Selected random question:', question);
    return question;
  }
  

  

// Update answer cards for players
// Update answer cards for players
function updateAnswerCards() {
    // Check if playerHands[currentPlayerIndex] is valid
    if (!playerHands[currentPlayerIndex]) {
      console.error(`No hand found for Player ${currentPlayerIndex + 1}`);
      return;
    }
  
    const playerHand = playerHands[currentPlayerIndex];
    console.log(`Updating cards for Player ${currentPlayerIndex + 1}`, playerHand);
  
    // Clear existing cards (excluding the black card)
    while (cardContainer.children.length > 1) {
      cardContainer.removeChild(cardContainer.lastChild);
    }
  
    // Display current player's hand
    for (let i = 0; i < playerHand.length; i++) {
      const answerCard = document.createElement('div');
      answerCard.classList.add('card', 'answer-card');
      answerCard.textContent = playerHand[i];
      answerCard.dataset.player = currentPlayerIndex + 1;
      cardContainer.appendChild(answerCard);
    }
  
    console.log('Answer cards updated for the current player.');
  }
  

  


// Shuffle the array of answers
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    console.log('Shuffled array:', array);
    return array;
  }
  

// Handle a player's answer selection
// Handle a player's answer selection
function handleAnswerSelection(card) {
    const answer = card.textContent;
    selectedAnswers[currentPlayerIndex] = { player: currentPlayerIndex + 1, answer };
   
    // Remove the selected card from the current player's hand
    const playerHand = playerHands[currentPlayerIndex];
    const cardIndex = playerHand.indexOf(answer);
    if (cardIndex > -1) {
      playerHand.splice(cardIndex, 1);
    }
  
    // Draw a new card if available
    if (answers.length > 0) {
      const newCardIndex = Math.floor(Math.random() * answers.length);
      const newCard = answers.splice(newCardIndex, 1)[0];
      playerHand.push(newCard);
    }
  
    console.log(`Player ${currentPlayerIndex + 1}  "${answer}"`); // Log the selected answer
    console.log(`Updated hand for Player ${currentPlayerIndex + 1}:`, playerHand);
  
    // Move to the next player
    currentPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;
  
    // If all players have selected their answers, move to the Card Master Phase
    if (selectedAnswers.filter(Boolean).length === totalPlayers) {
      console.log("All players have selected their answers. Transitioning to Card Master Phase.");
      console.log("Selected answers:", selectedAnswers); // Log all selected answers
      displaySelectedAnswers(); // Prepare answers for the card master
    } else {
      createBlackCard(); // Prompt the next player
    }
  }
  
  

// Display selected answers for the card master
function displaySelectedAnswers() {
    cardContainer.innerHTML = '';
    cardContainer.classList.add('card-master-phase');
  
    // Create the black card container
    const questionCard = document.createElement('div');
    questionCard.classList.add('card', 'black-card');
    questionCard.style.backgroundColor = 'black';
    questionCard.style.color = 'white';
  
    // Create the paragraph for "Card Master"
    const cardMasterParagraph = document.createElement('p');
    cardMasterParagraph.textContent = 'Card Master';


  
    // Create the paragraph for the question
    const questionParagraph = document.createElement('p');
    questionParagraph.textContent = ` ${currentQuestion}`;
  
    // Append paragraphs to the black card
    questionCard.appendChild(cardMasterParagraph);
    questionCard.appendChild(questionParagraph);
  
    // Add the black card to the container
    cardContainer.appendChild(questionCard);
  
    // Add the selected answer cards
    selectedAnswers.forEach(({ player, answer }) => {
      const answerCard = document.createElement('div');
      answerCard.classList.add('card', 'answer-card');
      answerCard.textContent = answer;
      answerCard.dataset.player = player;
      cardContainer.appendChild(answerCard);
    });
  
    console.log('Displayed selected answers for Card Master.');
  }
  
  
  


// Determine the winner
function determineWinner(card) {
    const winnerPlayer = card.dataset.player;
    const winnerAnswer = card.textContent;
  
    if (!winnerPlayer || !winnerAnswer) {
      console.error('Winner data is incomplete.');
      return;
    }
  
    console.log(`Winner determined: Player ${winnerPlayer} with the answer: "${winnerAnswer}"`);
    displayWinnerPrompt(winnerPlayer, winnerAnswer);
  
    // Call endRound() here to signal that the current round has ended
    endRound();
  }
  
  function endRound() {
    isRoundOver = true;
    console.log("The round is now over.");
  }
  
  
  
  // Display the winner prompt in the game UI (alternative to alert)
// Display the winner prompt and provide a way to start the next round
function displayWinnerPrompt(winnerPlayer, winnerAnswer) {
    console.log("Displaying winner prompt.");
    console.log(`Winner Player: ${winnerPlayer}, Winning Answer: "${winnerAnswer}"`);
  
    const winnerPrompt = document.createElement('div');
    winnerPrompt.classList.add('winner-prompt');
    winnerPrompt.innerHTML = `
    <h2>🎉 Player ${winnerPlayer} Wins! 🎉</h2>
    <p class="black-paragraph"> "${currentQuestion}"</p>
    <p>${winnerAnswer}"</p>
    <button class="next-round-btn">Next Round</button>
    `;
  
    // Add styles for the prompt
    winnerPrompt.style.position = 'absolute';
    winnerPrompt.style.top = '50%';
    winnerPrompt.style.left = '50%';
    winnerPrompt.style.transform = 'translate(-50%, -50%)';
 
    winnerPrompt.style.borderRadius = '10px';
    winnerPrompt.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
    winnerPrompt.style.textAlign = 'center';
    winnerPrompt.style.width = '310px';
    winnerPrompt.style.height = '410px';
    winnerPrompt.style.border = '1px solid black';
  
    // Add the prompt to the game container
    document.body.appendChild(winnerPrompt);
  
    // Add event listener to the "Next Round" button
    const nextRoundBtn = winnerPrompt.querySelector('.next-round-btn');
    nextRoundBtn.addEventListener('click', () => {
      console.log("Next round button clicked. Removing winner prompt and resetting the game.");
      document.body.removeChild(winnerPrompt);
      resetGame();
    });
  }
  
  // Reset the game for the next round
// Reset the game for the next round
function resetGame() {
    console.log("Resetting the game...");
  
    // Clear selected answers and reset the current player index
    selectedAnswers = [];
    currentPlayerIndex = 0;
    console.log("Cleared selected answers and reset current player index.");
  
    // Clear the card container and remove the Card Master phase class
    cardContainer.innerHTML = '';
    cardContainer.classList.remove('card-master-phase');
    console.log("Cleared card container and removed 'card-master-phase' class.");
  
    // Generate a new question
    currentQuestion = getRandomQuestion();
    console.log(`New question generated: "${currentQuestion}"`);
  
    // IMPORTANT: DO NOT deal cards to players again, playerHands should remain intact
    // dealCardsToPlayers(); <-- Remove or comment out this line to ensure hands persist
  
    // Add the black card for the next round
    console.log("Creating black card for the next round.");
    createBlackCard();
  
    // Add answer cards for the next round
    console.log("Updating answer cards for the next round.");
    updateAnswerCards();
  
    // Rearrange cards to ensure the black card is visually and logically first
    console.log("Rearranging cards to ensure proper stacking.");
    rearrangeCards();
  
    console.log("Game reset completed.");
  }
  
  
  




function rearrangeCards() {
    console.log("Rearranging cards...");

    const blackCard = cardContainer.querySelector('.black-card');

    if (blackCard) {
        console.log("Found black card. Moving it to the top of the DOM hierarchy.");
        // Move the black card to the top of the DOM hierarchy
        cardContainer.removeChild(blackCard);
        cardContainer.prepend(blackCard);
    } else {
        console.log("No black card found in the container.");
    }

    // Recalculate stacking order using translateZ
    const cards = Array.from(cardContainer.children);
    console.log("Recalculating stacking order for cards:", cards.map(card => card.textContent));

    cards.forEach((card, index) => {
        card.style.transition = 'none'; // Disable animations during reordering
        card.style.transform = `translateZ(${-index * 10}px)`; // Stack properly
        console.log(`Card "${card.textContent}" positioned with translateZ(${index * -10}px)`);
    });

    console.log("Final card order and transformations:", cards.map(card => ({
        content: card.textContent,
        transform: card.style.transform
    })));
}



function fixPlayer1CardOrder() {
    // Find all cards for Player 1 in the container
    const player1Cards = Array.from(cardContainer.children).filter(
        (card) => card.dataset.player === "1" && !card.classList.contains("black-card")
    );

    // Sort Player 1's cards by their transform translateZ values
    player1Cards.sort((a, b) => {
        const zA = parseInt(a.style.transform.match(/-?\d+/)[0], 10);
        const zB = parseInt(b.style.transform.match(/-?\d+/)[0], 10);
        return zA - zB;
    });

    // Reappend the cards for Player 1 in the correct order
    player1Cards.forEach((card) => {
        cardContainer.appendChild(card);
    });

    console.log("Player 1's cards reordered:", player1Cards.map(card => card.textContent));
}





// Event listeners for drag events
cardContainer.addEventListener('mousedown', handleDragStart);
cardContainer.addEventListener('mousemove', handleDragMove);
cardContainer.addEventListener('mouseup', handleDragEnd);
cardContainer.addEventListener('touchstart', handleDragStart);
cardContainer.addEventListener('touchmove', handleDragMove);
cardContainer.addEventListener('touchend', handleDragEnd);

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  console.log('Game Initialized');
});
