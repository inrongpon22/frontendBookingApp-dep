export const truncateContext = (context: string, maxLength: number) => {
    if (context.length > maxLength) {
        return context.substring(0, maxLength) + "...";
    }
    return context;
};
