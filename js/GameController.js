class Game {

	constructor(numberOfPlayers) {
		this.MAX_ROUNDS = 13;
		this._currentRound = 1;

		this._score = {};
		this._players = this._createPlayers(numberOfPlayers);
		this._players.forEach(p => this._score[p] = 0);
	}

	_createPlayers(count) {
		const players = [];
		players[0] = new HumanPlayer(`You`);
		for(let i = 1; i<count; i++) {
			players[i] = new Player(`Player ${i}`);
		}
		return players;
	}

	start() {
		this._gameRound = new GameRound(this._players.slice(0));
		this._gameRound.startGame();
	}
}

class GameRound {

	constructor(players) {
		this._deck = this._createNewDeck();
		this._stowedAway = this._deck.draw();

		this._currentPlayer = 0;
		this._players = players;
		this._playerStates = [];

		this._players.forEach(p => {
			const receiveCardSubject = new Rx.Subject();
			const playCardSubject = new Rx.Subject();
			const gameUpdateSubject = new Rx.Subject();
			this._playerStates.push(new PlayerState(receiveCardSubject, playCardSubject, gameUpdateSubject));
		});
	}

	_createNewDeck() {
		const deck = new Deck();
		deck.shuffle();

		return deck;
	}

	startGame() {
		// Assert that players are ready for new round
		this._players.forEach((player, index) => {
			const state = this._playerStates[index];
			player.initiateNewRound(state.getReceiveCardSubject(), state.getPlayCardSubject(), state.getGameUpdateSubject());

			// Give first card
			state.getReceiveCardSubject().onNext(this._deck.draw());
			this._players.forEach(otherPlayer => {
				if(otherPlayer.getName() !== player.getName()) {
					state.getGameUpdateSubject().onNext({'action': 'playerAdded', 'data': {'player': otherPlayer.getName()}});
				}
			});
		});

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
		this._playerStates.forEach(state => {
			state.getGameUpdateSubject().onNext({'action': 'cardPlayed', 'data': {'player': this._currentPlayer, 'card': cardInfo}});
		});

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
		} else {
			console.log(this._players);
		}
	}
}

class PlayerState {
	/**
	 * 1) One subject to hand out new cards (a.k.a first card OR notify that it is your turn)
	 * 2) One subject to play card
	 * 3) One subject to send general updates
	 */

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