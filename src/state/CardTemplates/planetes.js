import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import { TemplateTypes, StyleTypes } from './types'

export const Planetes = {
    Asteroid: {
        id: 'Asteroid',
        header: 'Asteroid',
        value: (<Glyph size={50} shape='ASTEROID' />),
        style: StyleTypes.Plain,
        type: TemplateTypes.Planete,
        resources: {
            ASTEROID: 1
        }
    },
    Comet: {
        id: 'Comet',
        header: 'Comet',
        value: (<Glyph size={50} shape='COMET' />),
        style: StyleTypes.Plain,
        type: TemplateTypes.Planete,
        resources: {
            COMET: 1
        }
    },
    Gas: {
        id: 'Gas',
        header: 'Gas Cloud',
        value: (<Glyph size={50} shape='GAS' />),
        style: StyleTypes.Plain,
        type: TemplateTypes.Planete,
        resources: {
            GAS: 1
        }
    },
}

export default Planetes