import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Resources = {
    Fuel1: {
        id: 'Fuel1',
        header: 'Fuel',
        value: (<Glyph size={50} shape='FUEL' />),
        resources: {
            FUEL: 1
        },
        style: 'plain',
        maxUses: 1,
        type: TemplateTypes.Resource        
    },
    Fuel2: {
        id: 'Fuel2',
        header: 'Fuel',
        value: (<div>2<Glyph size={50} shape='FUEL' /></div>),
        resources: {
            FUEL: 2
        },
        style: 'plain',
        maxUses: 1,
        type: TemplateTypes.Resource        
    },
    Ore1: {
        id: 'Ore1',
        header: 'Ore',
        value: (<Glyph size={50} shape='ORE' />),
        resources: {
            ORE: 1
        },
        style: 'plain',
        maxUses: 1,
        type: TemplateTypes.Resource
    },
    Science1: {
        id: 'Science1',
        header: 'Science',
        value: (<Glyph size={50} shape='SCIENCE' />),
        resources: {
            SCIENCE: 1
        },
        style: 'plain',
        maxUses: 1,
        type: TemplateTypes.Resource
    }
}

export default Resources