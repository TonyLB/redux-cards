import { connect } from 'react-redux'
import Clock from '../components/SVG/Clock'
import { elapsed } from '../state/timers'

const mapStateToProps = (state, ownProps) => ({
    ...(elapsed(state, ownProps.timerId)),
    lastTick: state.timers.lastTick
})

const mapDispatchToProps = ( dispatch ) => {
    return {
    }
}

const Countdown = connect(
    mapStateToProps,
    mapDispatchToProps
)(Clock)

export default Countdown