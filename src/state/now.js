//
// now
//
// A local wrapper around the new Date(0) function, largely so that it can be
// mocked in testing.
//

export const now = () => (
    new Date()
)

export default now