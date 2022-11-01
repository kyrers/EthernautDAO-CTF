//CODE BEING SERVED FROM LOCAL http-server INSTANCE WITH CORS DISABLED. THIS IS FOR DEBUG/DEVELOPMENT ONLY

export const loadChallengeContractCode = (path: any) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${process.env.REACT_APP_CONTRACTS_API}${path}`)
                .then(response => response.text())
                .then(text => resolve(text))
        }
        catch (error) {
            console.log(`ERROR LOADING FILE:`, error)
            reject(error)
        }
    })
}