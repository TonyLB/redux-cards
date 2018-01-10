import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import { TemplateTypes, StyleTypes } from './types'

export const DriveTech = {
    DeployBussard1: {
        id: 'DeployBussard1',
        header: 'Kickstart Bussard',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: StyleTypes.Control,
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
        header: 'Little Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        footer: <div>2<Glyph size={10} shape='GAS' />&rArr;1<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
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
        header: 'Bigger Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        upgrade: {
            'Bussard1': 'Bussard2',
            'DeployBussard1': 'DeployBussard2',
            'UpgradeBussard1': 'UpgradeBussard2'
        },
        payload: {
            EQUIPMENT: ['DesignBussard3']
        },
        cost: {
            FUEL: 4,
            ORE: 1
        },
        maxUses: 1,
        hideUses: true
    },
    DeployBussard2: {
        id: 'DeployBussard2',
        header: 'Kickstart Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: StyleTypes.Control,
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
        header: 'Bigger Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        footer: <div>3<Glyph size={10} shape='GAS' />&rArr;2<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
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
        header: 'Resonant Fields',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: StyleTypes.Science,
        type: TemplateTypes.Design,
        deploy: {
            EQUIPMENT: ['UpgradeBussard2']
        },
        cost: {
            SCIENCE: 3,
        },
        maxUses: 1,
        hideUses: true
    },
    UpgradeBussard2: {
        id: 'UpgradeBussard2',
        header: 'Huge Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        upgrade: {
            'Bussard2': 'Bussard3',
            'DeployBussard2': 'DeployBussard3'
        },
        cost: {
            FUEL: 6,
            ORE: 2
        },
        maxUses: 1,
        hideUses: true
    },
    DeployBussard3: {
        id: 'DeployBussard3',
        header: 'Kickstart Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        style: StyleTypes.Control,
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
        header: 'Huge Collector',
        value: <Glyph size={50} shape='BUSSARD' />,
        footer: <div>3<Glyph size={10} shape='GAS' />&rArr;2<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
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
    DeploySkimmers1: {
        id: 'DeploySkimmers1',
        header: 'Fuel Skimmers',
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Skimmers1']
        },
        cost: {
            ORE: 3
        }
    },
    Skimmers1: {
        id: 'Skimmers1',
        header: 'Fuel Skimmers',
        footer: <div>1<Glyph size={10} shape='GAS' />&rArr;2<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: StyleTypes.Control,
        maxUses: 1,        
        aggregates: [{
            cardTemplates: ['Gas'],
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Gas',
                required: 1,
            }],
            cardTemplate: 'Fuel2',
        }]
    },
    UpgradeDrive1: {
        id: 'UpgradeDrive1',
        header: 'Faster Rocket',
        footer: (<div ><Glyph size={15} shape='CARD' /><Glyph size={15} shape='CLOCK' /> Faster</div>),
        value: '',
        style: StyleTypes.Control,
        type: TemplateTypes.Payload,
        settings: {
            'HARVEST-TIMER': 1500
        },
        cost: {
            FUEL: 5,
            SCIENCE: 2
        },
        maxUses: 1,
        hideUses: true
    },
}

export default DriveTech