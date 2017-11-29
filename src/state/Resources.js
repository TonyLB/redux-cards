import React from 'react'
import Glyph from '../components/SVG/Glyph'

export const resourceShortForm = (prefix, resources) => (
    <div>
        {
            Object.entries(resources)
                .map(([key, val]) => (
                    <span key={prefix+key}>
                        {val}
                        <Glyph size={10} shape={key} />
                    </span>
                ))
        }
    </div>
)
