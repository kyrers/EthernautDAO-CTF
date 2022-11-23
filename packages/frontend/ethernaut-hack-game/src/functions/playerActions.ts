export const initializeStorage: any = (player: string) => {
    let currentPlayerInfo = localStorage.getItem(player);

    if (null === currentPlayerInfo) {
        localStorage.setItem(player, JSON.stringify([]));
    }
};

export const loadPlayerStorage: any = (player: string) => {
    let playerStatus = localStorage.getItem(player);
    let parsedPlayerStatus = JSON.parse(playerStatus!);

    let sessionStatus = sessionStorage.getItem("selectedChallenge");
    let parsedSessionStatus = null;
    if (null !== sessionStatus) {
        parsedSessionStatus = JSON.parse(sessionStatus);
    }

    return { playerStatus: parsedPlayerStatus, sessionStatus: parsedSessionStatus };
};

export const addChallengeInstance: any = (player: string, instance: any, callback: any) => {
    if (undefined !== instance) {
        let parsedInfo = loadPlayerStorage(player);
        parsedInfo.push(instance);
        localStorage.setItem(player, JSON.stringify(parsedInfo));
        callback();
    }
};

export const setChallengeSolved: any = (player: string, instanceAddress: string, callback: any) => {
    let parsedInfo: [any] = loadPlayerStorage(player);
    parsedInfo.find(challenge => challenge.instanceAddress === instanceAddress).solved = true;
    localStorage.setItem(player, JSON.stringify(parsedInfo));
    callback();
};

export const storeSelectedChallenge: any = (challenge: any) => {
    sessionStorage.setItem("selectedChallenge", JSON.stringify(challenge));
};