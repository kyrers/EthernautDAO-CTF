export default function loadContractCode(data: any) {

    return new Promise((resolve, reject) => {
        try {
            fetch(data)
                .then(response => response.text())
                .then(text => {
                    resolve(text)
                })
        }
        catch (error) {
            console.log(`ERROR LOADING FILE:`, error)
            reject(error)
        }
    })
}