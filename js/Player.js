class Player {
	constructor(name) {
		this._name = name;
		this._opponents = [];
		this._playedCards = [];
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
		} else if(action === 'playerRemoved') {
			const index = this._opponents.indexOf(data.player);
			this._opponents.splice(index, 1);
		} else if(action === 'cardPlayed') {
			this._playedCards.push(data.card);
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