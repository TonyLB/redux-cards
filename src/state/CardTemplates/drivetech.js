import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const DriveTech = {
    DeployBussard1: {
        id: 'DeployBussard1',
        header: 'Kickstart Bussard',
        value: '',
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
        footer: <div>2<Glyph size={10} shape='GAS' />&rArr;1<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplates: 'Gas',
            maxStack: 2
        }],
        purchases: [{
            cardTemplate: 'Fuel1',
        }]
    },
    UpgradeBussard1: {
        id: 'UpgradeBussard1',
        header: 'Upgrade Bussard',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        upgrade: {
            'Bussard1': 'Bussard2',
            'DeployBussard1': 'DeployBussard2'
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
        value: '',
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
        footer: <div>3<Glyph size={10} shape='GAS' />&rArr;2<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplates: 'Gas',
            maxStack: 3
        }],
        purchases: [{
            cardTemplate: 'Fuel2',
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
        cost: {
            ORE: 5
        },
        maxUses: 1,
        hideUses: true
    }
}

export default DriveTech