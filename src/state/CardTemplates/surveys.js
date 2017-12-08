import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Surveys = {
    PlotIntercept1: {
        id: 'PlotIntercept1',
        header: 'Plot Intercept',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Intercept1']
        },
        cost: {
            FUEL: 2
        }
    },
    Intercept1: {
        id: 'Intercept1',
        header: 'Intercept',
        footer: (<div>1<Glyph size={10} shape='COMET' />&rArr;1<Glyph size={10} shape='SCIENCE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 1,
        aggregates: [{
            cardTemplates: 'Comet',
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Comet',
                required: 1,
            }],
            cardTemplate: 'Science1',
        }]
    },
    Survey: {
        id: 'Survey',
        header: 'Survey',
        style: 'science',
        type: TemplateTypes.Payload,
        maxUses: 1,
        hideUses: true,
        payload: {
            DISCARD: ['Asteroid', 'Asteroid', 'Comet']
        },
        cost: {
            FUEL: 4,
        }
    },
    DesignSensor1: {
        id: 'DesignSensor1',
        header: 'Sensor Dish',
        value: '',
        style: 'science',
        type: TemplateTypes.Design,
        maxUses: 1,
        hideUses: true,
        deploy: {
            EQUIPMENT: ['BuildSensor1']
        },
        cost: {
            SCIENCE: 3,
        }
    },
    BuildSensor1: {
        id: 'BuildSensor1',
        header: 'Add Sensor Dish',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        maxUses: 1,
        hideUses: true,
        upgrade: {
            'Intercept1': 'Intercept2',
            'PlotIntercept1': 'PlotIntercept2'
        },
        cost: {
            ORE: 6,
            FUEL: 4
        }
    },
    PlotIntercept2: {
        id: 'PlotIntercept2',
        header: 'Plot Intercept',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['Intercept2']
        },
        cost: {
            FUEL: 2
        }
    },
    Intercept2: {
        id: 'Intercept2',
        header: 'Intercept',
        footer: (<div>1<Glyph size={10} shape='COMET' />&rArr;2<Glyph size={10} shape='SCIENCE' /></div>),
        type: TemplateTypes.Aggregator,
        style: 'control',
        maxUses: 1,
        aggregates: [{
            cardTemplates: 'Comet',
            maxStack: 1
        }],
        purchases: [{
            price: [{
                cardTemplate: 'Comet',
                required: 1,
            }],
            cardTemplate: 'Science2',
        }]
    },
}

export default Surveys