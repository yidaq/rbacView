import React from 'react'

function FrameBorder() {
    return (
        <iframe
            src="http://localhost:8080/druid/sql.html"
            width="100%"
            height="2300px"
            frameborder="0"
            scrolling="no"
        // allowtransparency="true"
        />

    )
}

export default FrameBorder
