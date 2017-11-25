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
        value: 'X',
        style: 'plain',
        type: TemplateTypes.Resource
    },
    YCard: {
        id: 'YCard',
        value: 'Y',
        style: 'plain',
        type: TemplateTypes.Resource
    },
    ZCard: {
        id: 'ZCard',
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