import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Storage = {
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
            cardTemplates: ['Ore1', 'Ore2', 'Ore5'],
            maxStack: 5
        }],
    },
    DesignFuelTank: {
        id: 'DesignFuelTank',
        header: 'Fuel Tank',
        value: '',
        style: 'science',
        type: TemplateTypes.Design,
        deploy: {
            EQUIPMENT: ['BuildFuelTank']
        },
        cost: {
            SCIENCE: 3,
        }
    },
    BuildFuelTank: {
        id: 'BuildFuelTank',
        header: 'Fuel Tank',
        value: '',
        style: 'control',
        type: TemplateTypes.Payload,
        deploy: {
            DISCARD: ['FuelTank']
        },
        cost: {
            ORE: 5
        }
    },
    FuelTank: {
        id: 'FuelTank',
        header: 'Fuel Tank',
        footer: <div>Holds 5<Glyph size={10} shape='FUEL' /></div>,
        type: TemplateTypes.Storage,
        style: 'control',        
        aggregates: [{
            cardTemplates: ['Fuel1', 'Fuel2', 'Fuel5'],
            maxStack: 5
        }],
    },
    DesignAsteroidBelt: {
        id: 'DesignAsteroidBelt',
        header: 'Asteroid Belt',
        value: '',
        style: 'science',
        type: TemplateTypes.Design,
        deploy: {
            DISCARD: ['AsteroidBelt']
        },
        cost: {
            SCIENCE: 2,
        }
    },
    AsteroidBelt: {
        id: 'AsteroidBelt',
        header: 'Asteroid Belt',
        footer: <div>Holds 5<Glyph size={10} shape='ASTEROID' /></div>,
        type: TemplateTypes.Storage,
        style: 'control',        
        aggregates: [{
            cardTemplates: 'Asteroid',
            maxStack: 5
        }],
    }
}

export default Storage