class Player {
	constructor() {}

	initiateNewRound(newCardSubject, playSubject, updateSubject) {
		// TODO this._disposeOldSubcriptions();
		this._currentCard = undefined;

		this._playSubject = playSubject;
		this._newCardSubscription = newCardSubject.subscribe(card => this.receiveNewCard(card));
		this._gameUpdateSubscription = updateSubject.subscribe(update => this.receiveGameUpdate(update));
	}

	receiveNewCard(newCard) {
		console.log(`Received card`);
		console.log(newCard);
		if(!this._currentCard) {
			this._currentCard = newCard;
		} else {
			console.log(this);
			this._play(newCard);
		}
	}

	receiveGameUpdate(gameUpdate) {

	}

	_play(drawnCard) {
		// Play drawn card or card on hand
		const tmp = this._currentCard;
		this._currentCard = drawnCard;
		this._playSubject.onNext(tmp);
	}
}