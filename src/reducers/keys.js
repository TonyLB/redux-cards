let sequenceNumber=1

const generateKey = prefix => {
    return prefix + (sequenceNumber++);
}

export { generateKey }