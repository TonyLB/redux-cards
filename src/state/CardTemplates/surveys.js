import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Surveys = {
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
    Intercept: {
        id: 'Intercept',
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
    }
}

export default Surveys