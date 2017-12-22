class Debug {
	static log(txt) {
    	document.querySelector('#debug').innerHTML += `${txt}<br />`;
  	}
}