import CardTemplates from '../state/CardTemplates'
import { moveCards, addCards, deployCards, combineMoveCards, replaceCards, setTimers, changeSetting } from '../actions'
import { cardsToSpend } from '../state/hand'
import { useCardMoves, moveThenCondense } from './hand'

export const purchaseCard = (card, track) => (dispatch, getState) => {
    let state = getState()

    let purchaseTemplate = CardTemplates[state.cards.byId[card].cardTemplate]
    let cards = cardsToSpend(state, purchaseTemplate.cost)
    let shortCuts = state.hand.shortCuts

    if (cards.length) {

        const discard = moveCards([{ id: card, source: track, destination: state.tracks.byId[track].deck }])
        const price = moveCards(useCardMoves(state, cards.map(spentCard => ({ ...spentCard, destination: shortCuts['DISCARD'] }))))
        dispatch(moveThenCondense(state, combineMoveCards([ discard, price ])))

        const payload = purchaseTemplate.payload ? 
            addCards(Object.entries(purchaseTemplate.payload)
                .map(([key, val]) => (
                    val.map(newCard => ({ cardTemplate: newCard, destination: shortCuts[key]}))
                ))
                .reduce((output, moves) => ( output.concat(moves) ), []),
            ) : null

        const deploy = purchaseTemplate.deploy ? 
            deployCards(Object.entries(purchaseTemplate.deploy)
                .map(([key, val]) => (
                    val.map(newCard => ({ cardTemplate: newCard, destination: shortCuts[key]}))
                ))
                .reduce((output, moves) => ( output.concat(moves) ), []),
                card
            ) : null

        const outMoves = payload ? 
            (deploy ? combineMoveCards([ payload, deploy ]) : payload) :
            deploy

        if (outMoves) { dispatch(outMoves) }

        if (purchaseTemplate.upgrade) {
            dispatch(replaceCards(purchaseTemplate.upgrade))
        }

        if (purchaseTemplate.boost) {
            const timers = Object.entries(purchaseTemplate.boost)
                .filter(([key, val]) => (state.timers.byId[key]))
                .map(([key, val]) => ({ id: key, duration: val }))
            const settings = Object.entries(purchaseTemplate.boost)
                .filter(([key, val]) => (!state.timers.byId[key]))

            if (timers.length) {
                dispatch(setTimers(timers))
            }
            if (settings.length) {
                dispatch(changeSetting(Object.assign({}, settings)))
            }
            
        }

    }
}