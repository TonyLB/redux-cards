import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import { TemplateTypes, StyleTypes } from './types'

export const Mining = {
    EVAFuel1: {
        id: 'EVAFuel1',
        header: 'Repair a Spacesuit',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining1']
        },
        cost: {
            ORE: 1
        }
    },
    EVAMining1: {
        id: 'EVAMining1',
        header: 'Dig in Space',
        footer: (<div>2<Glyph size={10} shape='ASTEROID' />&rArr;1<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
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
        header: 'Plated Spacesuit',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        upgrade: {
            EVAFuel1: 'EVAFuel2',
            EVAMining1: 'EVAMining2'
        },
        payload: {
            SCIENCE: ['DesignEVA3']
        },
        cost: {
            ORE: 4,
            FUEL: 2
        },
        maxUses: 1,
        hideUses: true
    },
    EVAFuel2: {
        id: 'EVAFuel2',
        header: 'Fix a Spacesuit',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining2']
        },
        cost: {
            ORE: 1
        }
    },
    EVAMining2: {
        id: 'EVAMining2',
        header: 'Mining in Space',
        footer: (<div>3<Glyph size={10} shape='ASTEROID' />&rArr;2<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
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
        header: 'Invent Smartcloth',
        value: '',
        style: StyleTypes.Science,
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
        header: 'Smartcloth Spacesuit',
        value: '',
        style: StyleTypes.Control,
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
        header: 'Fix a Spacesuit',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining3']
        },
        cost: {
            ORE: 2
        }
    },
    EVAMining3: {
        id: 'EVAMining3',
        header: 'Laser Mining',
        footer: (<div>3<Glyph size={10} shape='ASTEROID' />&rArr;5<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
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
    DeploySmelter1: {
        id: 'DeploySmelter1',
        header: 'Small Smelter',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Smelter1']
        },
        cost: {
            FUEL: 3,
            ORE: 3
        }
    },
    Smelter1: {
        id: 'Smelter1',
        header: 'Small Smelter',
        value: '',
        footer: <div>3<Glyph size={10} shape='ORE' />&rArr;1 > <Glyph size={10} shape='ORE' /></div>,
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
        aggregates: [{
            cardTemplates: ['Ore1', 'Ore2', 'Ore5'],
            maxStack: 5
        }],
        purchases: [
            {
                persistent: true,
                price: [{
                    cardTemplate: 'Ore1',
                    required: 3,
                }],
                cardTemplate: 'Ore2',
            },
            {
                persistent: true,
                price: [{
                    cardTemplate: 'Ore2',
                    required: 3,
                }],
                cardTemplate: 'Ore5',
            },
        ]
    },
}

export default Mining