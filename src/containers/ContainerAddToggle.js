import { connect } from 'react-redux'
import { addToggle } from '../actions'
import AddToggle from '../components/AddToggle'

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onClick: () => {
            dispatch(addToggle('Test Toggle'))
        }
    }
}

const ContainerAddToggle = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddToggle)

export default ContainerAddToggle