import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import { TemplateTypes, StyleTypes } from './types'

export const Resources = {
    Fuel1: {
        id: 'Fuel1',
        header: 'Fuel',
        value: (<Glyph size={50} shape='FUEL' />),
        resources: {
            FUEL: 1
        },
        style: StyleTypes.Plain,
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
        style: StyleTypes.Plain,
        maxUses: 1,
        type: TemplateTypes.Resource        
    },
    Fuel5: {
        id: 'Fuel5',
        header: 'Fuel',
        value: (<div>5<Glyph size={50} shape='FUEL' /></div>),
        resources: {
            FUEL: 5
        },
        style: StyleTypes.Plain,
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
        style: StyleTypes.Plain,
        maxUses: 1,
        type: TemplateTypes.Resource
    },
    Ore2: {
        id: 'Ore2',
        header: 'Ore',
        value: (<div>2<Glyph size={50} shape='ORE' /></div>),
        resources: {
            ORE: 2
        },
        style: StyleTypes.Plain,
        maxUses: 1,
        type: TemplateTypes.Resource
    },
    Ore5: {
        id: 'Ore5',
        header: 'Ore',
        value: (<div>5<Glyph size={50} shape='ORE' /></div>),
        resources: {
            ORE: 5
        },
        style: StyleTypes.Plain,
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
        style: StyleTypes.Plain,
        maxUses: 1,
        type: TemplateTypes.Resource
    },
    Science2: {
        id: 'Science2',
        header: 'Science',
        value: (<div>2<Glyph size={50} shape='SCIENCE' /></div>),
        resources: {
            SCIENCE: 2
        },
        style: StyleTypes.Plain,
        maxUses: 1,
        type: TemplateTypes.Resource
    },
    Science5: {
        id: 'Science5',
        header: 'Science',
        value: (<div>5<Glyph size={50} shape='SCIENCE' /></div>),
        resources: {
            SCIENCE: 5
        },
        style: StyleTypes.Plain,
        maxUses: 1,
        type: TemplateTypes.Resource
    }
}

export default Resources