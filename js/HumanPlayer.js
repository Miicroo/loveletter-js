class HumanPlayer {
	constructor(name) {
		this._name = name;
		this._opponents = [];
		this._playedCardsPerOpponent = {};
		this._uiControl = new UIControl();
	}

	initiateNewRound(newCardSubject, playSubject, updateSubject) {
		// TODO this._disposeOldSubcriptions();
		this._currentCard = undefined;

		this._playSubject = playSubject;
		this._newCardSubscription = newCardSubject.subscribe(card => this.receiveNewCard(card));
		this._gameUpdateSubscription = updateSubject.subscribe(update => this.receiveGameUpdate(update));
	}

	receiveNewCard(newCard) {
		// console.log(`${this._name} received card`);
		// console.log(newCard);
		if(!this._currentCard) {
			this._currentCard = newCard;
		} else {
			this._play(newCard);
		}
	}

	receiveGameUpdate(gameUpdate) {
		const action = gameUpdate.action;
		const data = gameUpdate.data;

		if(action === 'playerAdded') {
			this._opponents.push(data.player);
			this._uiControl.addPlayer(data.player);
		} else if(action === 'playerRemoved') {
			const index = this._opponents.indexOf(data.player);
			this._opponents.splice(index, 1);

			this._uiControl.removePlayer(data.player);
		} else if(action === 'cardPlayed') {
			if(!this._playedCardsPerOpponent.hasOwnProperty(data.player)) {
				this._playedCardsPerOpponent[data.player] = [];
			}
			this._playedCardsPerOpponent[data.player].push(data.card);
			const cardIndex = this._playedCardsPerOpponent[data.player].length - 1;

			this._uiControl.addCardToPlayerAtIndex(data.card, data.player, cardIndex);
		}
		console.log(gameUpdate);
	}

	_play(drawnCard) {
		// Play drawn card or card on hand
		const tmp = this._currentCard;
		this._currentCard = drawnCard;

		const cardInfo = {'card': tmp};
		this._playSubject.onNext(cardInfo);
	}

	getName() {
		return this._name;
	}
}

class UIControl {
	// TODO change this as it is more of controls than a real class
	constructor() {}

	addPlayer(player) {
		const playerDiv = this._getDivForPlayer(player);
		playerDiv.classList.remove('hidden');
	}

	removePlayer(player) {
		const playerDiv = this._getDivForPlayer(player);
		playerDiv.style.opacity = 0.5;
	}

	addCardToPlayerAtIndex(card, player, index) {
		const playerDiv = this._getDivForPlayer(player);

		const img = document.createElement('img');
		img.src = `images/${card.getDisplayName().toLowerCase()}.jpg`;
		img.style.zIndex = index;
		img.style.position = 'absolute';
		img.style.left = `${index*50}px`;
		playerDiv.appendChild(img);
	}

	showMyHand(cards) {

	}

	_getDivForPlayer(player) {
		console.log(player);
		const divId = player.replace(' ', '').toLowerCase();
		return document.querySelector(`#${divId}`);
	}
}