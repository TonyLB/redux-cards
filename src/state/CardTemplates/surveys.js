import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import { TemplateTypes, StyleTypes } from './types'

export const Surveys = {
    TargetProbe1: {
        id: 'TargetProbe1',
        header: 'Program a probe',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Probe1']
        },
        cost: {
            SCIENCE: 1
        }
    },
    Probe1: {
        id: 'Probe1',
        header: 'Dumb Comet Probe',
        value: '',
        footer: (<div>1<Glyph size={10} shape='COMET' />&rArr;1<Glyph size={10} shape='SCIENCE' /></div>),
        style: StyleTypes.Control,
        type: TemplateTypes.Aggregator,
        maxUses: 3,
        aggregates: [{
            cardTemplates: 'Comet',
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Comet',
                required: 1,
            }],
            cardTemplate: 'Science1',
        }]
    },
    TargetProbe2: {
        id: 'TargetProbe2',
        header: 'Program a probe',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Probe2']
        },
        cost: {
            SCIENCE: 1
        }
    },
    Probe2: {
        id: 'Probe2',
        header: 'Smart Comet Probe',
        value: '',
        footer: (<div>1<Glyph size={10} shape='COMET' />&rArr;1<Glyph size={10} shape='SCIENCE' /></div>),
        style: StyleTypes.Control,
        type: TemplateTypes.Aggregator,
        maxUses: 3,
        aggregates: [{
            cardTemplates: 'Comet',
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Comet',
                required: 1,
            }],
            cardTemplate: 'Science2',
        }]
    },
    PlotIntercept1: {
        id: 'PlotIntercept1',
        header: 'Chase a Comet',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Intercept1']
        },
        cost: {
            FUEL: 2
        }
    },
    Intercept1: {
        id: 'Intercept1',
        header: 'Catch a Comet',
        footer: (<div>1<Glyph size={10} shape='COMET' />&rArr;1<Glyph size={10} shape='SCIENCE' /></div>),
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
        maxUses: 1,
        aggregates: [{
            cardTemplates: 'Comet',
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Comet',
                required: 1,
            }],
            cardTemplate: 'Science1',
        }]
    },
    FindDeposit1: {
        id: 'FindDeposit1',
        header: 'Find ore deposit',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['MineDeposit1']
        },
        cost: {
            SCIENCE: 2
        }
    },
    MineDeposit1: {
        id: 'MineDeposit1',
        header: 'Scoop deposit',
        value: '',
        footer: (<div>1<Glyph size={10} shape='ASTEROID' />&rArr;2<Glyph size={10} shape='ORE' /></div>),
        style: StyleTypes.Control,
        type: TemplateTypes.Aggregator,
        maxUses: 1,
        aggregates: [{
            cardTemplates: 'Asteroid',
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Asteroid',
                required: 1,
            }],
            cardTemplate: 'Ore2',
        }]
    },
    Survey: {
        id: 'Survey',
        header: 'Survey',
        style: StyleTypes.Science,
        type: TemplateTypes.Payload,
        maxUses: 1,
        hideUses: true,
        payload: {
            DISCARD: ['Asteroid', 'Asteroid', 'Comet']
        },
        cost: {
            FUEL: 4,
        }
    },
    UpgradeProbe1: {
        id: 'UpgradeProbe1',
        header: 'Smarter Probes',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        maxUses: 1,
        hideUses: true,
        upgrade: {
            'TargetProbe1': 'TargetProbe2',
            'Probe1': 'Probe2'
        },
        cost: {
            SCIENCE: 3,
            ORE: 1
        }
    },
    UpgradeProbe1: {
        id: 'UpgradeProbe1',
        header: 'Smarter Probes',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        maxUses: 1,
        hideUses: true,
        upgrade: {
            'TargetProbe1': 'TargetProbe2',
            'Probe1': 'Probe2'
        },
        cost: {
            SCIENCE: 3,
            ORE: 1
        }
    },
    UpgradeSensor1: {
        id: 'UpgradeSensor1',
        header: 'Add Sensor Dish',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        maxUses: 1,
        hideUses: true,
        upgrade: {
            'Intercept1': 'Intercept2',
            'PlotIntercept1': 'PlotIntercept2'
        },
        cost: {
            SCIENCE: 3,
            ORE: 2
        }
    },
    PlotIntercept2: {
        id: 'PlotIntercept2',
        header: 'Chase a Comet',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Intercept2']
        },
        cost: {
            FUEL: 2
        }
    },
    Intercept2: {
        id: 'Intercept2',
        header: 'Catch a Comet',
        footer: (<div>1<Glyph size={10} shape='COMET' />&rArr;2<Glyph size={10} shape='SCIENCE' /></div>),
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
        maxUses: 1,
        aggregates: [{
            cardTemplates: 'Comet',
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Comet',
                required: 1,
            }],
            cardTemplate: 'Science5',
        }]
    },
    DeployLaboratory1: {
        id: 'DeployLaboratory1',
        header: 'Make small laboratory',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Laboratory1']
        },
        cost: {
            SCIENCE: 3
        }
    },
    Laboratory1: {
        id: 'Laboratory1',
        header: 'Simple Laboratory',
        footer: (<div>3<Glyph size={10} shape='SCIENCE' />&rArr;1 > <Glyph size={10} shape='SCIENCE' /></div>),
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
        aggregates: [{
            cardTemplates: ['Science1', 'Science2', 'Science5'],
            maxStack: 5
        }],
        purchases: [
            {
                persistent: true,
                price: [{
                    cardTemplate: 'Science1',
                    required: 3,
                }],
                cardTemplate: 'Science2',
            },
            {
                persistent: true,
                price: [{
                    cardTemplate: 'Science2',
                    required: 3,
                }],
                cardTemplate: 'Science5',
            }
        ]
    },
}

export default Surveys