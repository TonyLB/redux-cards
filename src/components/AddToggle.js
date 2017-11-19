import React from 'react'
import PropTypes from 'prop-types'

const AddToggle = ({ onClick }) => (
    <button onClick={onClick}>
        Add Toggle
    </button>
)

AddToggle.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default AddToggle