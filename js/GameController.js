class GameController {
	constructor() {
		// Set up deck
		this.deck = new Deck();
		this.deck.shuffle();
		this._stowedAway = this.deck.draw();

		// Set up players
		this.players = this._createPlayers(4, this.deck);
	}

	_createPlayers(count, deck) {
		const players = [];
		for(let i = 0; i<count; i++) {
			players[i] = new Player(deck.draw(), this); // TODO Change this to iface
		}
		return players;
	}
}

class GameInterface {
	constructor() {

	}

	play(card, args) {
		if(args.length < card.getArgumentCount()) {
			return; //
		}
		
		card.getPlayFunction().apply(null, arr);
	}
}