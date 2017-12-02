import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Mining = {
    EVAFuel: {
        id: 'EVAFuel',
        header: 'Fuel EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining']
        },
        cost: {
            FUEL: 2
        }
    },
    EVAMining: {
        id: 'EVAMining',
        header: 'EVA Mining',
        footer: (<div>2<Glyph size={10} shape='ASTEROID' />&rArr;1<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 3,
        aggregates: [{
            cardTemplate: 'Asteroid',
            maxStack: 2
        }],
        purchases: [{
            cardTemplate: 'Ore1',
        }]
    }
}

export default Mining