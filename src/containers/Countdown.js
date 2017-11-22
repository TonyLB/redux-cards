import { connect } from 'react-redux'
import Clock from '../components/SVG/Clock'

const mapStateToProps = (state, ownProps) => {
    return {
        ...(state.timers.byId[ownProps.timerId])
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return {
    }
}

const Countdown = connect(
    mapStateToProps,
    mapDispatchToProps
)(Clock)

export default Countdown