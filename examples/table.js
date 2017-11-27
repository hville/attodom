import {D, element as el, list} from '../module'
import {Store} from './Store' // any user store will do
import {ic_remove, ic_add} from './icons'

var store = new Store([])

var table = el('table').child(
	el('caption').class('f4').text('table example with...'),
	el('tbody').child(
		list(function(rowKey) {
			return el('tr').child(
				el('td') //leading column with icon
					.on('click', function() {store.delRow(rowKey) })
					.child(ic_remove.cloneNode(true)),
				list(function(colKey) {
					return el('td') // data columns
						.child(
							el('input').set('update', function(v) { this.node.value = v })
								.on('change', function() {store.set(this.node.value, [rowKey, colKey]) } )
						)
				})
			)
		}),
		el('tr').child(
			el('td')
				.on('click', function() { store.addRow() } )
				.child(ic_add)
		)
	)
)
.moveTo(D.body)

store.onchange = function() { table.update( store.get() ) }
store.set([
	['icons', 'SVG icons'],
	['keyed', 'keyed list'],
	['store', 'data flow'],
	['event', 'event listeners']
])

store.addRow = function() {
	store.set(['',''], store.get().length)
}

store.delRow = function(idx) {
	var data = store.get().slice()
	data.splice(idx,1)
	store.set(data)
}
