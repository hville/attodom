export var D = typeof document !== 'undefined' ? document : null
export var W = typeof window !== 'undefined' ? window : null

/**
* @function setWindow
* @param  {Window} win
* @return {Window}
*/
export function setWindow(win) {
	D = win.document
	return W = win
}
