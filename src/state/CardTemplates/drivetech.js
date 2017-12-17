import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const DriveTech = {
    DeployBussard1: {
        id: 'DeployBussard1',
        header: 'Kickstart Bussard',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Bussard1']
        },
        cost: {
            GAS: 2
        }
    },
    Bussard1: {
        id: 'Bussard1',
        header: 'Bussard Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        footer: <div>2<Glyph size={10} shape='GAS' />&rArr;1<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplates: ['Gas'],
            maxStack: 2
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Gas',
                required: 2,
            }],
            cardTemplate: 'Fuel1',
        }],
        alternateName: 'Stow'
    },
    UpgradeBussard1: {
        id: 'UpgradeBussard1',
        header: 'Upgrade Bussard',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: 'control',
        type: TemplateTypes.Payload,
        upgrade: {
            'Bussard1': 'Bussard2',
            'DeployBussard1': 'DeployBussard2',
            'UpgradeBussard1': 'UpgradeBussard2'
        },
        payload: {
            SCIENCE: ['DesignBussard3']
        },
        cost: {
            ORE: 4
        },
        maxUses: 1,
        hideUses: true
    },
    DeployBussard2: {
        id: 'DeployBussard2',
        header: 'Kickstart Bussard',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Bussard2']
        },
        cost: {
            GAS: 2
        }
    },
    Bussard2: {
        id: 'Bussard2',
        header: 'Bussard Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        footer: <div>3<Glyph size={10} shape='GAS' />&rArr;2<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplates: 'Gas',
            maxStack: 3
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Gas',
                required: 3,
            }],
            cardTemplate: 'Fuel2',
        }],
        alternateName: 'Stow'
    },
    DesignBussard3: {
        id: 'DesignBussard3',
        header: 'Bussard 3.0',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: 'science',
        type: TemplateTypes.Design,
        deploy: {
            EQUIPMENT: ['UpgradeBussard2']
        },
        cost: {
            SCIENCE: 5,
        },
        maxUses: 1,
        hideUses: true
    },
    UpgradeBussard2: {
        id: 'UpgradeBussard1',
        header: 'Upgrade Bussard',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: 'control',
        type: TemplateTypes.Payload,
        upgrade: {
            'Bussard2': 'Bussard3',
            'DeployBussard2': 'DeployBussard3'
        },
        cost: {
            ORE: 20
        },
        maxUses: 1,
        hideUses: true
    },
    DeployBussard3: {
        id: 'DeployBussard3',
        header: 'Kickstart Bussard',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Bussard2']
        },
        cost: {
            GAS: 2
        }
    },
    Bussard3: {
        id: 'Bussard3',
        header: 'Bussard Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        footer: <div>3<Glyph size={10} shape='GAS' />&rArr;2<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplates: ['Gas', 'Fuel5'],
            maxStack: 5
        }],
        purchases: [{
            persistent: true,
            price: [{
                cardTemplate: 'Gas',
                required: 3,
            }],
            cardTemplate: 'Fuel5',
        }],
        alternateName: 'Stow'
    },
    DeployFracking1: {
        id: 'DeployFracking1',
        header: 'Drive Fracking',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Fracking1']
        },
        cost: {
            FUEL: 3
        }
    },
    Fracking1: {
        id: 'Fracking1',
        header: 'Fracture Asteroid',
        footer: <div>1<Glyph size={10} shape='ASTEROID' />&rArr;2<Glyph size={10} shape='ORE' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 1,        
        aggregates: [{
            cardTemplates: ['Asteroid'],
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
    UpgradeDrive1: {
        id: 'UpgradeDrive1',
        header: 'Upgrade Drive',
        footer: (<div ><Glyph size={15} shape='CARD' /><Glyph size={15} shape='CLOCK' /> Faster</div>),
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        settings: {
            'HARVEST-TIMER': 1500
        },
        upgrade: {
            'Fracking1': 'Fracking2',
            'DeployFracking1': 'DeployFracking2'
        },
        cost: {
            ORE: 5
        },
        maxUses: 1,
        hideUses: true
    },
    DeployFracking2: {
        id: 'DeployFracking2',
        header: 'Drive Fracking',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Fracking2']
        },
        cost: {
            FUEL: 5
        }
    },
    Fracking2: {
        id: 'Fracking2',
        header: 'Fracture Asteroid',
        footer: <div>1<Glyph size={10} shape='ASTEROID' />&rArr;5<Glyph size={10} shape='ORE' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 1,
        aggregates: [{
            cardTemplates: ['Asteroid'],
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Asteroid',
                required: 1,
            }],
            cardTemplate: 'Ore5',
        }]
    },
}

export default DriveTech