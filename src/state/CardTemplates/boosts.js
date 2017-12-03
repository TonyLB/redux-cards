import React from 'react'
import TemplateTypes from './types'

export const Boosts = {
    AutoDraw: {
        id: 'AutoDraw',
        header: 'Logistics Center',
        value: '',
        footer: <div>Auto-draw</div>,
        style: 'control',
        type: TemplateTypes.Payload,
        settings: {
            'AUTO-DRAW': true
        },
        cost: {
            ORE: 6,
            FUEL: 4
        }
    },
}

export default Boosts