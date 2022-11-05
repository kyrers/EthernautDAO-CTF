export const initializeStorage: any = async (player: string) => {
    localStorage.setItem(player, JSON.stringify([]));
};
