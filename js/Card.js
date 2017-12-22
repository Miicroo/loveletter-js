class Card {
	constructor(value, displayName, argumentCount) {
		this.value = value;
		this.displayName = displayName;
		this.argumentCount = argumentCount;
	}

	getValue() {
		return this.value;
	}

	getDisplayName() {
		return this.displayName;
	}

	getArgumentCount() {
		return this.argumentCount;
	}
}