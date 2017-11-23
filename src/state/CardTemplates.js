const TemplateTypes = {
    Payload: 'PAYLOAD',
    Resource: 'RESOURCE'
}

const CardTemplates = {
    Types: TemplateTypes,
    ACard: {
        id: 'ACard',
        value: 'A',
        type: TemplateTypes.Payload,
        payload: ['ZCard']
    },
    BCard: {
        id: 'BCard',
        value: 'B',
    },
    CCard: {
        id: 'CCard',
        value: 'C',
    },
    XCard: {
        id: 'XCard',
        value: 'X',
        type: TemplateTypes.Resource
    },
    YCard: {
        id: 'YCard',
        value: 'Y',
        type: TemplateTypes.Resource
    },
    ZCard: {
        id: 'ZCard',
        value: 'Z',
        type: TemplateTypes.Resource
    }
}

export default CardTemplates