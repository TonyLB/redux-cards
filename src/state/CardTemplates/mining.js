import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Mining = {
    EVAFuel1: {
        id: 'EVAFuel1',
        header: 'Fuel EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining1']
        },
        cost: {
            FUEL: 2
        }
    },
    EVAMining1: {
        id: 'EVAMining1',
        header: 'EVA Mining',
        footer: (<div>2<Glyph size={10} shape='ASTEROID' />&rArr;1<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 3,
        aggregates: [{
            cardTemplates: 'Asteroid',
            maxStack: 2
        }],
        purchases: [{
            cardTemplate: 'Ore1',
        }]
    },
    UpgradeEVA1: {
        id: 'UpgradeEVA1',
        header: 'Upgrade EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        upgrade: {
            EVAFuel1: 'EVAFuel2',
            EVAMining1: 'EVAMining2'
        },
        cost: {
            ORE: 3,
            FUEL: 3
        }
    },
    EVAFuel2: {
        id: 'EVAFuel1',
        header: 'Fuel EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining2']
        },
        cost: {
            FUEL: 2
        }
    },
    EVAMining2: {
        id: 'EVAMining1',
        header: 'EVA Mining',
        footer: (<div>3<Glyph size={10} shape='ASTEROID' />&rArr;2<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 3,
        aggregates: [{
            cardTemplates: 'Asteroid',
            maxStack: 3
        }],
        purchases: [{
            cardTemplate: 'Ore2',
        }]
    }
}

export default Mining