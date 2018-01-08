import { TemplateTypes } from './types'
import Planetes from './planetes'
import Resources from './resources'
import DriveTech from './drivetech'
import Surveys from './surveys'
import Mining from './mining'
import Storage from './storage'
import Boosts from './boosts'

export const CardTemplates = {
    Types: TemplateTypes,
    ...Planetes,
    ...Resources,
    ...DriveTech,
    ...Surveys,
    ...Mining,
    ...Storage,
    ...Boosts
}

export default CardTemplates