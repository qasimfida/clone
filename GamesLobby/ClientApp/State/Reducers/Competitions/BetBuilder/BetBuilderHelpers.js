export const emptyMultibetOptions = () => {
    return {
        singles: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        doubles: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        triples: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        fold4: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        fold5: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        fold6: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        fold7: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        trixie: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        patent: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        yankee: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        lucky15: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        superYankee: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        lucky31: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        lucky63: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        heinz: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false },
        superHeinz: { amount: 0, ew: false, bets: 0, odds: 1, enabled: false }
    };
};



const factorial = (num) => {
    var rval = 1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
};



const calculateOdds = function* (elements, length) {
    for (let i = 0; i < elements.length; i++) {
        if (length === 1) {
            yield [elements[i]];
        } else {
            let remaining = calculateOdds(elements.slice(i + 1, elements.length), length - 1);
            for (let next of remaining) {
                yield [elements[i], ...next];
            }
        }
    }
};


export const calculateCombinations = (n, r) => {
    var nFact = factorial(n);
    var bets = nFact / (factorial(r) * (factorial(n - r)));
    return {
        bets: bets,
        odds: 1
    };
};


export const calculateSystemCombinations = (selections, amount, n, type) => {
    var results = {
        bets: [],
        total: 0,
        odds: 0
    };

    const calculate = (c, n) => {
        const combinations = calculateCombinations(c, n);
        results.total += combinations.bets;
        results.bets.push(combinations);

        if (amount > 0) {
            const a = Array.from(calculateOdds(selections, n));
            a.map(x => {
                var odds = 1;
                x.map(y => {
                    odds *= y.price;
                });
                results.odds += odds;
            });
        }

        results.odds = results.odds;
    };

    switch (type) {
        case 'singles':
            results.total += n;
            results.odds = 1;
            Object.values(selections).map(x => results.odds *= x.price);
            break;
        case 'doubles':
            calculate(n, 2);
            break;
        case 'triples':
            calculate(n, 3);
            break;
        case 'trixie':
            calculate(n, 2);
            calculate(n, 3);
            break;
        case 'patent':
            results.total += n;
            calculate(n, 2);
            calculate(n, 3);
            break;
        case 'yankee':
            calculate(n, 2);
            calculate(n, 3);
            calculate(n, 4);
            break;
        case 'lucky15':
            results.total += n;
            calculate(n, 2);
            calculate(n, 3);
            calculate(n, 4);
            break;
        case 'superYankee':
            calculate(n, 2);
            calculate(n, 3);
            calculate(n, 4);
            break;
        case 'lucky31':
            results.total += n;
            calculate(n, 2);
            calculate(n, 3);
            calculate(n, 4);
            calculate(n, 5);
            break;
        case 'heinz':
            calculate(n, 2);
            calculate(n, 3);
            calculate(n, 4);
            calculate(n, 5);
            calculate(n, 6);
            break;
        case 'lucky63':
            results.total += n;
            calculate(n, 2);
            calculate(n, 3);
            calculate(n, 4);
            calculate(n, 5);
            calculate(n, 6);
            break;
        case 'superHeinz':
            calculate(n, 2);
            calculate(n, 3);
            calculate(n, 4);
            calculate(n, 5);
            calculate(n, 6);
            calculate(n, 7);
            break;
        case 'fold4':
            calculate(n, 4);
            break;
        case 'fold5':
            calculate(n, 5);
            break;
        case 'fold6':
            calculate(n, 6);
            break;
        case 'fold7':
            calculate(n, 7);
            break;
    }

    return results;
};



export const combineAll = (array) => {
    const res = [];
    let max = array.length - 1;
    const helper = (arr, i) => {
        for (let j = 0, l = array[i].length; j < l; j++) {
            let copy = arr.slice(0);
            copy.push(array[i][j]);
            if (i == max)
                res.push(copy);
            else
                helper(copy, i + 1);
        }
    };
    helper([], 0);
    return res;
};




export const calculate = (slip) => {
    const selections = Object.values(slip.selections).filter(x => x.selected);

    var stake = 0;
    const bets = selections.length;
    var totalBets = 0;
    var possibleWin = 0;
    slip.multipleBetOptionsEnabled = true;

    slip.multipleBetOptions.singles.enabled = bets > 0;
    slip.multipleBetOptions.doubles.enabled = bets > 1;
    slip.multipleBetOptions.triples.enabled = bets > 2;
    slip.multipleBetOptions.trixie.enabled = bets > 2;
    slip.multipleBetOptions.fold4.enabled = bets == 4;
    slip.multipleBetOptions.fold5.enabled = bets == 5;
    slip.multipleBetOptions.fold6.enabled = bets == 6;
    slip.multipleBetOptions.fold7.enabled = bets == 7;
    slip.multipleBetOptions.patent.enabled = bets > 2;
    slip.multipleBetOptions.yankee.enabled = bets > 3;
    slip.multipleBetOptions.lucky15.enabled = bets > 3;
    slip.multipleBetOptions.superYankee.enabled = bets > 4;
    slip.multipleBetOptions.lucky31.enabled = bets > 4;
    slip.multipleBetOptions.lucky63.enabled = bets > 5;
    slip.multipleBetOptions.heinz.enabled = bets > 5;
    slip.multipleBetOptions.superHeinz.enabled = bets > 6;

    if (bets >= 7) {
        slip.multipleBetOptionsEnabled = false;
    }

    Object.keys(slip.multipleBetOptions).map(type => {
        var system = slip.multipleBetOptions[type];
        if (system.enabled) {
            var calculation = calculateSystemCombinations(selections, system.amount, bets, type);
            system.bets = calculation.total;

            if (system.amount > 0) {
                totalBets += system.bets;
                system.odds = calculation.odds;
                stake += (system.bets * system.amount);
                possibleWin += system.odds * system.amount;
            }
            slip.multipleBetOptions[type].bets = system.bets;
        }
    });



    slip.totalSelections = bets;
    slip.possibleWin = possibleWin;
    slip.bets = totalBets;
    slip.stake = stake;
    return slip;
};



export const calculateRacing = (slip) => {
    const selections = Object.values(slip.selections).filter(x => x.selected);

    var stake = 0;
    const bets = selections.length;
    var totalBets = 0;
    var possibleWin = 0;
    slip.multipleBetOptionsEnabled = true;

    var reccurentEvents = Object.values(slip.events).filter(x => x > 1).length > 0;
    var combinations = Object.values(slip.selections).filter(x => x.forecast || x.tricast).length > 0;


    slip.multipleBetOptions.singles.enabled = bets > 0;
    slip.multipleBetOptions.doubles.enabled = bets > 1;
    slip.multipleBetOptions.triples.enabled = bets > 2;
    slip.multipleBetOptions.trixie.enabled = bets > 2;
    slip.multipleBetOptions.fold4.enabled = bets == 4;
    slip.multipleBetOptions.fold5.enabled = bets == 5;
    slip.multipleBetOptions.fold6.enabled = bets == 6;
    slip.multipleBetOptions.fold7.enabled = bets == 7;
    slip.multipleBetOptions.patent.enabled = bets > 2;
    slip.multipleBetOptions.yankee.enabled = bets > 3;
    slip.multipleBetOptions.lucky15.enabled = bets > 3;
    slip.multipleBetOptions.superYankee.enabled = bets > 4;
    slip.multipleBetOptions.lucky31.enabled = bets > 4;
    slip.multipleBetOptions.lucky63.enabled = bets > 5;
    slip.multipleBetOptions.heinz.enabled = bets > 5;
    slip.multipleBetOptions.superHeinz.enabled = bets > 6;

    slip.reccurentEvents = reccurentEvents;
    slip.combinations = combinations;

    if (bets >= 7 || reccurentEvents || combinations) {
        slip.multipleBetOptionsEnabled = false;
    }
    if (slip.reccurentEvents || slip.combinations) totalBets = bets;

    Object.keys(slip.multipleBetOptions).map(type => {
        var system = slip.multipleBetOptions[type];
        if (system.enabled) {
            var calculation = calculateSystemCombinations(selections, system.amount, bets, type);
            system.bets = calculation.total;


            if (system.amount > 0) {
                totalBets += system.bets;
                system.odds = calculation.odds;
                const ew = system.ew;
                var amount = system.amount * (ew ? 2 : 1);

                // check each selection
                if (!ew && type == 'singles') {
                    amount = 0;
                    Object.values(slip.selections).map(x => {
                        x.amount = system.amount;
                        x.totalAmount = system.amount * (x.ew ? 2 : 1);
                        amount += system.amount * (x.ew ? 2 : 1);
                    });
                    stake += amount;
                } else {
                    stake += (system.bets * amount);
                }

                possibleWin += system.odds * system.amount;
            }
            slip.multipleBetOptions[type].bets = system.bets;
        }
    });




    slip.totalSelections = bets;
    slip.possibleWin = possibleWin;
    slip.bets = totalBets;
    slip.stake = stake;
    return slip;
};
