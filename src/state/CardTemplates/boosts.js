import React from 'react'
import { TemplateTypes, StyleTypes } from './types'

export const Boosts = {
    AutoDraw: {
        id: 'AutoDraw',
        header: 'Logistics Center',
        value: '',
        footer: <div>Auto-draw</div>,
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        settings: {
            'AUTO-DRAW': true
        },
        cost: {
            ORE: 6,
            FUEL: 4
        },
        maxUses: 1,
        hideUses: true
    },
}

export default Boosts