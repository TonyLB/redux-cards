import CardTemplates from '../state/CardTemplates'
import { moveCards, addCards, deployCards, combineMoveCards, replaceCards } from '../actions'
import { setTimers } from '../actions/timers'
import { changeSetting } from '../actions/settings'
import { cardsToSpend } from '../state/hand'
import { useCardMoves, moveThenCondense } from './hand'

export const purchaseCard = (card, track) => (dispatch, getState) => {
    let state = getState()

    let purchaseTemplate = CardTemplates[state.cards.byId[card].cardTemplate]
    let cards = cardsToSpend(state, purchaseTemplate.cost)
    let shortCuts = state.hand.shortCuts

    if (cards.length) {

        const discard = moveCards(useCardMoves(state, [{ id: card, source: track, destination: state.tracks.byId[track].deck }]))
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

        if (purchaseTemplate.settings) {
            const timers = Object.entries(purchaseTemplate.settings)
                .filter(([key, val]) => (state.timers.byId[key]))
                .map(([key, val]) => ({ id: key, duration: val }))
            const settings = Object.entries(purchaseTemplate.settings)
                .filter(([key, val]) => (!state.timers.byId[key]))
                .map(([key, val]) => ({ [key]: val}))

            if (timers.length) {
                dispatch(setTimers(timers))
            }
            if (settings.length) {
                dispatch(changeSetting(Object.assign({}, ...settings)))
            }
            
        }

    }
}

export const advanceTrack = (trackId) => (dispatch, getState) => {
    const state = getState()
    if (!state) { return }

    const track = state.tracks.byId[trackId]
    if (!track) { return }

    const discardAction = (track.cards.length >= track.trackSize) 
        ? moveCards([{
            id: track.cards[0],
            source: trackId,
            destination: track.deck
        }])
        : ''

    const filteredDeck = state.stacks.byId[track.deck].cards
        .filter(card => (state.cards.byId[card].deployed === undefined))

    const cardAction = filteredDeck.length 
        ? moveCards([{ 
            id: filteredDeck[0],
            source: track.deck,
            destination: trackId
        }])
        : ''

    if (discardAction) {
        if (cardAction) {
            dispatch(combineMoveCards([ discardAction, cardAction ]))
        }
        else {
            dispatch(moveCards([{
                id: track.cards[0],
                source: trackId,
                destination: trackId
            }]))    
        }
    }
    else if (cardAction) {
        dispatch(cardAction)
    }
}