import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const DriveTech = {
    Bussard: {
        id: 'Bussard',
        header: 'Bussard Collector',
        footer: <div>2<Glyph size={10} shape='GAS' />&rArr;1<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplate: 'Gas',
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
            Bussard: 'Bussard2'
        },
        cost: {
            ORE: 4
        }
    },
    Bussard2: {
        id: 'Bussard2',
        header: 'Bussard Collector',
        footer: <div>3<Glyph size={10} shape='GAS' />&rArr;2<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplate: 'Gas',
            maxStack: 3
        }],
        purchases: [{
            cardTemplate: 'Fuel2',
        }]
    }
}

export default DriveTech