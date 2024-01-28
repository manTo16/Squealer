


export function concatNoDuplicates(array1: string[], array2: string[]): string[] {
    //console.log("array1: ", array1, " array2: ", array2)
    const set = new Set(array1.concat(array2));
    return Array.from(set);
}