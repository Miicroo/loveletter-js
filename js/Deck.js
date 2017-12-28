class Deck {
	constructor() {
		this.cards = [];
		this._addCards();
	}

	_addCards() {
		// 5 guards
		this.cards.push(new Card(1, 'Guard', 2));
		this.cards.push(new Card(1, 'Guard', 2));
		this.cards.push(new Card(1, 'Guard', 2));
		this.cards.push(new Card(1, 'Guard', 2));
		this.cards.push(new Card(1, 'Guard', 2));

		// 2 priests
		this.cards.push(new Card(2, 'Priest', 1));
		this.cards.push(new Card(2, 'Priest', 1));

		// 2 barons
		this.cards.push(new Card(3, 'Baron', 1));
		this.cards.push(new Card(3, 'Baron', 1));

		// 2 handmaids
		this.cards.push(new Card(4, 'Handmaid', 0));
		this.cards.push(new Card(4, 'Handmaid', 0));

		// 2 princes
		this.cards.push(new Card(5, 'Prince', 1));
		this.cards.push(new Card(5, 'Prince', 1));

		// 1 king
		this.cards.push(new Card(6, 'King', 1));

		// 1 countess
		this.cards.push(new Card(7, 'Countess', 0));

		// 1 princess
		this.cards.push(new Card(8, 'Princess', 0));
	}

	shuffle() {
		const tmp = this.cards.slice(0);
		for(let i = 0; i<(tmp.length * tmp.length); i++) {
			this._moveCards(tmp); 
		}
		this.cards = tmp.slice(0);
	}

	_moveCards(arr) {
		const card1Index = this._randomCardIndex(arr);
		const card2Index = this._randomCardIndex(arr);

		const tmpCard = arr[card1Index];
		arr[card1Index] = arr[card2Index];
		arr[card2Index] = tmpCard;
	}

	_randomCardIndex(arr) {
		return Math.floor(Math.random() * arr.length);
	}

	draw() {
		return this.cards.shift();
	}

	showAll() {
		return this.cards;
	}

	isEmpty() {
		return this.cards.length == 0;
	}
}