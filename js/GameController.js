class Game {

	constructor() {
		this.MAX_ROUNDS = 13;
		this._currentRound = 1;

		this._score = {};
		this._players = this._createPlayers(4);
		this._players.forEach(p => this._score[p] = 0);

		this._gameRound = new GameRound(this._players);
		this._gameRound.startGame();
	}

	_createPlayers(count) {
		const players = [];
		for(let i = 0; i<count; i++) {
			players[i] = new Player();
		}
		return players;
	}
}

class GameRound {
/**
	* new Rx.Subject()
	*
	* One subject per player to notify it is your turn (a.k.a send card), one subject to all players to "play", one subject to send general "updates"
	*/
	constructor(players) {
		this._deck = this._createNewDeck();
		this._stowedAway = this._deck.draw();

		this._currentPlayer = 0;
		this._players = players;
		this._playerStates = [];

		// Assert that players are ready for new round
		players.forEach(p => {
			const receiveCardSubject = new Rx.Subject();
			const playCardSubject = new Rx.Subject();
			const gameUpdateSubject = new Rx.Subject();
			this._playerStates.push(new PlayerState(receiveCardSubject, playCardSubject, gameUpdateSubject));

			p.initiateNewRound(receiveCardSubject, playCardSubject, gameUpdateSubject);
			receiveCardSubject.onNext(this._deck.draw());
		});
	}

	_createNewDeck() {
		const deck = new Deck();
		deck.shuffle();

		return deck;
	}

	startGame() {
		this._playCurrentPlayer();
	}

	_playCurrentPlayer() {
		const playerState = this._playerStates[this._currentPlayer];

		this._currentPlaySubscription = playerState.getPlayCardSubject().subscribe(playedCardInfo => this._playCard(playedCardInfo));
		playerState.getReceiveCardSubject().onNext(this._deck.draw());
	}

	_playCard(cardInfo) {
		console.log(`Player ${this._currentPlayer} played`);
		console.log(cardInfo);

		this._nextPlayer();
	}

	_nextPlayer() {
		if(this._currentPlaySubscription) {
			this._currentPlaySubscription.dispose();
			this._currentPlaySubscription = undefined;
		}

		this._currentPlayer = (this._currentPlayer + 1) % this._players.length;

		if(!this._deck.isEmpty()) {
			this._playCurrentPlayer();
		}
	}
}

class PlayerState {
	constructor(receiveCardSubject, playCardSubject, gameUpdateSubject) {
		this._currentCards = [];
		this._receiveCardSubject = receiveCardSubject;
		this._playCardSubject = playCardSubject;
		this._gameUpdateSubject = gameUpdateSubject;

		this._setUpListeners();
	}

	_setUpListeners() {
		this._receiveCardSubject.subscribe(card => this._addCard(card));
		this._playCardSubject.subscribe(card => this._removeCard(card));
	}

	_addCard(card) {
		this._currentCards.push(card);
	}

	_removeCard(card) {
		const index = this._currentCards.indexOf(card);
		this._currentCards.splice(index, 1);
	}

	getCurrentCards() {
		return this._currentCards;
	}

	getReceiveCardSubject() {
		return this._receiveCardSubject;
	}

	getPlayCardSubject() {
		return this._playCardSubject;
	}

	getGameUpdateSubject() {
		return this._gameUpdateSubject;
	}
}