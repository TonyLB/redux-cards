import React from 'react'
import Glyph from '../components/SVG/Glyph'

export const TemplateTypes = {
    Payload: 'PAYLOAD',
    Resource: 'RESOURCE',
    Aggregator: 'AGGREGATOR',
    Priority: {
        PAYLOAD: 1,
        RESOURCE: 1,
        AGGREGATOR: 2
    }
}

export const CardTemplates = {
    Types: TemplateTypes,
    EVAFuel: {
        id: 'EVAFuel',
        header: 'Fuel EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        payload: ['EVAMining'],
        priority: 2
    },
    Asteroid: {
        id: 'Asteroid',
        header: 'Asteroid',
        footer: (<div>1<Glyph size={10} shape='ASTEROID' /></div>),
        value: (<Glyph size={50} shape='ASTEROID' />),
        style: 'plain',
        type: TemplateTypes.Resource
    },
    Comet: {
        id: 'Comet',
        header: 'Comet',
        footer: (<div>1<Glyph size={10} shape='COMET' /></div>),
        value: (<Glyph size={50} shape='COMET' />),
        style: 'plain',
        type: TemplateTypes.Resource
    },
    Gas: {
        id: 'Gas',
        header: 'Gas Cloud',
        footer: (<div>1<Glyph size={10} shape='GAS' /></div>),
        value: (<Glyph size={50} shape='GAS' />),
        style: 'plain',
        type: TemplateTypes.Resource
    },
    Fuel1: {
        id: 'Fuel1',
        header: 'Fuel',
        footer: (<div>1<Glyph size={10} shape='FUEL' /></div>),
        value: (<Glyph size={50} shape='FUEL' />),
        style: 'plain',
        type: TemplateTypes.Resource        
    },
    Ore1: {
        id: 'Ore1',
        header: 'Ore',
        footer: (<div>1<Glyph size={10} shape='ORE' /></div>),
        value: (<Glyph size={50} shape='ORE' />),
        style: 'plain',
        type: TemplateTypes.Resource
    },
    EVAMining: {
        id: 'EVAMining',
        header: 'EVA Mining',
        footer: (<div>2<Glyph size={10} shape='ASTEROID' />&rArr;1<Glyph size={10} shape='ORE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 3,
        aggregates: [{
            cardTemplate: 'Asteroid',
            maxStack: 2
        }],
        purchases: [{
            cardTemplate: 'Ore1',
        }]
    },
    Bussard: {
        id: 'Bussard',
        header: 'Bussard Collector',
        footer: <div>2<Glyph size={10} shape='GAS' />&rArr;1F</div>,
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
    
}

export default CardTemplates