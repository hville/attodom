export var D = typeof document !== 'undefined' ? document : null

/**
* @function setDocument
* @param  {Document} doc DOM document
* @return {Document} DOM document
*/
export function setDocument(doc) {
	return D = doc
}
