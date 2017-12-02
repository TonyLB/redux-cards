import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Boosts = {
    DrawSpeed1: {
        id: 'DrawSpeed1',
        header: 'Logistics Center',
        footer: (<div style={{ fontSize:'140%' }}>&dArr;<Glyph size={15} shape='CARD' /><Glyph size={15} shape='CLOCK' /></div>),
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        boost: {
            'HARVEST-TIMER': 1500
        },
        cost: {
            ORE: 5
        }
    },
}

export default Boosts