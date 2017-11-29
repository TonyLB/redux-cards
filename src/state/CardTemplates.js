import React from 'react'
import Glyph from '../components/SVG/Glyph'

export const TemplateTypes = {
    Aggregator: 'AGGREGATOR',
    Payload: 'PAYLOAD',
    Planete: 'PLANETE',
    Resource: 'RESOURCE',
    Storage: 'STORAGE',
    Priority: {
        PAYLOAD: 1,
        PLANETE: 1,
        RESOURCE: 1,
        STORAGE: 2,
        AGGREGATOR: 3
    }
}

export const CardTemplates = {
    Types: TemplateTypes,
    Asteroid: {
        id: 'Asteroid',
        header: 'Asteroid',
        footer: (<div>1<Glyph size={10} shape='ASTEROID' /></div>),
        value: (<Glyph size={50} shape='ASTEROID' />),
        style: 'plain',
        type: TemplateTypes.Planete
    },
    Comet: {
        id: 'Comet',
        header: 'Comet',
        footer: (<div>1<Glyph size={10} shape='COMET' /></div>),
        value: (<Glyph size={50} shape='COMET' />),
        style: 'plain',
        type: TemplateTypes.Planete
    },
    Gas: {
        id: 'Gas',
        header: 'Gas Cloud',
        footer: (<div>1<Glyph size={10} shape='GAS' /></div>),
        value: (<Glyph size={50} shape='GAS' />),
        style: 'plain',
        type: TemplateTypes.Planete
    },
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
    },
    EVAFuel: {
        id: 'EVAFuel',
        header: 'Fuel EVA',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['EVAMining']
        },
        cost: {
            FUEL: 2
        }
    },
    Intercept: {
        id: 'Intercept',
        header: 'Intercept',
        footer: (<div>1<Glyph size={10} shape='COMET' />&rArr;1<Glyph size={10} shape='SCIENCE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 1,
        aggregates: [{
            cardTemplate: 'Comet',
            maxStack: 1
        }],
        purchases: [{
            cardTemplate: 'Science1',
        }]
    },
    PlotIntercept: {
        id: 'PlotIntercept',
        header: 'Plot Intercept',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Intercept']
        },
        cost: {
            FUEL: 2
        }
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
    DesignCargoBay: {
        id: 'DesignCargoBay',
        header: 'Cargo Bay',
        value: '',
        style: 'science',
        type: TemplateTypes.Design,
        deploy: {
            EQUIPMENT: ['BuildCargoBay']
        },
        cost: {
            SCIENCE: 3,
        }
    },
    BuildCargoBay: {
        id: 'BuildCargoBay',
        header: 'Cargo Bay',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['CargoBay']
        },
        cost: {
            ORE: 5
        }
    },
    CargoBay: {
        id: 'CargoBay',
        header: 'Cargo Bay',
        footer: <div>Holds 5<Glyph size={10} shape='ORE' /></div>,
        type: TemplateTypes.Storage,
        style: 'control',        
        aggregates: [{
            cardTemplate: 'Ore1',
            maxStack: 5
        }],
    }
}

export default CardTemplates