import React from 'react'
import Glyph from '../components/SVG/Glyph'

export const TemplateTypes = {
    Payload: 'PAYLOAD',
    Resource: 'RESOURCE',
    Aggregator: 'AGGREGATOR'
}

export const CardTemplates = {
    Types: TemplateTypes,
    ACard: {
        id: 'ACard',
        value: 'A',
        style: 'control',
        type: TemplateTypes.Payload,
        payload: ['ZCard']
    },
    BCard: {
        id: 'BCard',
        value: 'B',
        style: 'control'
    },
    CCard: {
        id: 'CCard',
        value: 'C',
        style: 'control'
    },
    XCard: {
        id: 'XCard',
        header: 'Asteroid',
        footer: (<div>1<Glyph size={10} shape='ASTEROID' /></div>),
        value: (<Glyph size={50} shape='ASTEROID' />),
        style: 'plain',
        type: TemplateTypes.Resource
    },
    YCard: {
        id: 'YCard',
        header: 'Comet',
        footer: (<div>1<Glyph size={10} shape='COMET' /></div>),
        value: (<Glyph size={50} shape='COMET' />),
        style: 'plain',
        type: TemplateTypes.Resource
    },
    ZCard: {
        id: 'ZCard',
        footer: 'Test',
        value: 'Z',
        type: TemplateTypes.Aggregator,
        style: 'control',
        aggregates: [{
            cardTemplate: 'XCard',
            maxStack: 5
        }]
    }
}

export default CardTemplates