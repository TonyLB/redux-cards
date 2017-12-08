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
            price: [{
                cardTemplate: 'Asteroid',
                required: 2,
            }],
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
        payload: {
            SCIENCE: ['DesignEVA3']
        },
        cost: {
            ORE: 3,
            FUEL: 3
        },
        maxUses: 1,
        hideUses: true
    },
    EVAFuel2: {
        id: 'EVAFuel2',
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
        id: 'EVAMining2',
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
            price: [{
                cardTemplate: 'Asteroid',
                required: 3,
            }],
            cardTemplate: 'Ore2',
        }]
    },
    DesignEVA3: {
        id: 'DesignEVA3',
        header: 'EVA 3.0',
        value: '',
        style: 'science',
        type: TemplateTypes.Design,
        deploy: {
            EQUIPMENT: ['UpgradeEVA2']
        },
        cost: {
            SCIENCE: 5,
        },
        maxUses: 1,
        hideUses: true
    },
    UpgradeEVA2: {
        id: 'UpgradeEVA2',
        header: 'Upgrade EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        upgrade: {
            EVAFuel2: 'EVAFuel3',
            EVAMining2: 'EVAMining3'
        },
        cost: {
            ORE: 15,
            FUEL: 15
        },
        maxUses: 1,
        hideUses: true
    },
    EVAFuel3: {
        id: 'EVAFuel3',
        header: 'Fuel EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining3']
        },
        cost: {
            FUEL: 5
        }
    },
    EVAMining3: {
        id: 'EVAMining3',
        header: 'EVA Mining',
        footer: (<div>3<Glyph size={10} shape='ASTEROID' />&rArr;5<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 3,
        aggregates: [{
            cardTemplates: 'Asteroid',
            maxStack: 3
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Asteroid',
                required: 3,
            }],
            cardTemplate: 'Ore5',
        }]
    },
}

export default Mining