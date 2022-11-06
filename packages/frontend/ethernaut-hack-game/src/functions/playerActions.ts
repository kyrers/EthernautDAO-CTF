export const initializeStorage: any = (player: string) => {
    let currentPlayerInfo = localStorage.getItem(player);

    if (currentPlayerInfo === null) {
        localStorage.setItem(player, JSON.stringify([]));
    }
};

export const loadPlayerStorage: any = (player: string) => {
    let currentPlayerInfo = localStorage.getItem(player);
    let parsedInfo = JSON.parse(currentPlayerInfo!);
    return parsedInfo;
}

export const addChallengeInstance: any = (player: string, instance: any, callback: any) => {
    if (instance !== undefined) {
        let parsedInfo = loadPlayerStorage(player);
        parsedInfo.push(instance);
        localStorage.setItem(player, JSON.stringify(parsedInfo));
        callback();
    }
};
