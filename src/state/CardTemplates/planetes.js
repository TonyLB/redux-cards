import React from 'react'
import Glyph from '../../components/SVG/Glyph'
import TemplateTypes from './types'

export const Planetes = {
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
}

export default Planetes