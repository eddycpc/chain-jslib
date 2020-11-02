import { expect } from 'chai';
import { fuzzyDescribe } from '../test/mocha-fuzzy/suite';

import { CroSDK, croSDK } from '../core/cro';

const cro = croSDK({ network: CroSDK.Testnet });

describe('Coin', function () {
    describe('constructor', function () {
        fuzzyDescribe('should throw Error when the provided argument is not (string, Unit)', function (fuzzy) {
            const testRunner = fuzzy(fuzzy.StringArg('1000'), fuzzy.StringArg(cro.coin.Coin.UNIT_BASE));
            testRunner(
                function (args0, args1) {
                    if (!args0.valid) {
                        expect(() => new cro.coin.Coin(args0.value, args1.value)).to.throw(
                            'Expected `amount` to be of type `string`',
                        );
                    } else if (!args1.valid) {
                        expect(() => new cro.coin.Coin(args0.value, args1.value)).to.throw(
                            'Expected `unit` to be of type `string`',
                        );
                    }
                },
                { invalidArgsOnly: true },
            );
        });

        context('When unit is base unit', function () {
            it('should throw Error when the provided string is not a valid number', function () {
                expect(() => new cro.coin.Coin('invalid', cro.coin.Coin.UNIT_BASE)).to.throw(
                    'Expected amount to be a base10 number represented as string',
                );
            });

            it('should throw Error when the provided string is a floating number', function () {
                expect(() => new cro.coin.Coin('1234.5678', cro.coin.Coin.UNIT_BASE)).to.throw(
                    'Expected base amount to be an integer',
                );
            });

            it('should throw Error when the provided string is not a base10 number', function () {
                expect(() => new cro.coin.Coin('0xff', cro.coin.Coin.UNIT_BASE)).to.throw(
                    'Expected amount to be a base10 number represented as string',
                );
            });

            it('should throw Error when the provided string is a negative integer', function () {
                expect(() => new cro.coin.Coin('-1000', cro.coin.Coin.UNIT_BASE)).to.throw(
                    'Expected base amount to be positive',
                );
            });

            it('should throw Error if the value exceed total supply', function () {
                expect(() => new cro.coin.Coin('10000000000000000001', cro.coin.Coin.UNIT_BASE)).to.throw(
                    'Expected base amount to be within total supply',
                );
            });

            it('should return a coins object of the provided string', function () {
                const anyBaseValue = '1000';
                const coins = new cro.coin.Coin(anyBaseValue, cro.coin.Coin.UNIT_BASE);

                expect(coins.toString()).to.eq(anyBaseValue);
            });
        });

        context('When unit is CRO', function () {
            it('should throw Error when the provided string is not a valid number', function () {
                expect(() => new cro.coin.Coin('invalid', cro.coin.Coin.UNIT_CRO)).to.throw(
                    'Expected amount to be a base10 number represented as string',
                );
            });

            it('should throw Error when the provided string is not a base10 number', function () {
                expect(() => new cro.coin.Coin('0xff', cro.coin.Coin.UNIT_CRO)).to.throw(
                    'Expected amount to be a base10 number represented as string',
                );
            });

            it('should throw Error when the provided string is a negative integer', function () {
                expect(() => new cro.coin.Coin('-1000', cro.coin.Coin.UNIT_CRO)).to.throw(
                    'Expected CRO amount to be positive',
                );
            });

            it('should throw Error when the provided string exceed 8 decimal places', function () {
                expect(() => new cro.coin.Coin('1000.123456789', cro.coin.Coin.UNIT_CRO)).to.throw(
                    'Expected CRO amount to have at most 8 decimal places',
                );
            });

            it('should throw Error if the value exceed total supply', function () {
                expect(() => new cro.coin.Coin('100000000001', cro.coin.Coin.UNIT_CRO)).to.throw(
                    'Expected CRO amount to be within total supply',
                );
            });

            it('should return a coins object of the provided string', function () {
                const anyCROValue = '0.00001';
                const coins = new cro.coin.Coin(anyCROValue, cro.coin.Coin.UNIT_CRO);

                const expectedBaseValue = '1000';
                expect(coins.toString()).to.eq(expectedBaseValue);
            });
        });
    });

    describe('fromBaseUnit', function () {
        fuzzyDescribe('should throw Error when the provided value is not a string', function (fuzzy) {
            const testRunner = fuzzy(fuzzy.StringArg('1000'));
            testRunner(
                function (arg) {
                    expect(() => cro.coin.Coin.fromBaseUnit(arg.value)).to.throw(
                        'Expected `amount` to be of type `string`',
                    );
                },
                { invalidArgsOnly: true },
            );
        });

        it('should throw Error when the provided string is not a valid number', function () {
            expect(() => cro.coin.Coin.fromBaseUnit('invalid')).to.throw(
                'Expected amount to be a base10 number represented as string,',
            );
        });

        it('should throw Error when the provided string is a floating number', function () {
            expect(() => cro.coin.Coin.fromBaseUnit('1234.5678')).to.throw('Expected base amount to be an integer');
            expect(() => cro.coin.Coin.fromBaseUnit('-1234.5678')).to.throw('Expected base amount to be an integer');
        });

        it('should throw Error when the provided string is not a base10 number', function () {
            expect(() => cro.coin.Coin.fromBaseUnit('0xff')).to.throw(
                'Expected amount to be a base10 number represented as string',
            );
        });

        it('should throw Error when the provided string is a negative integer', function () {
            expect(() => cro.coin.Coin.fromBaseUnit('-1000')).to.throw('Expected base amount to be positive');
        });

        it('should throw Error if the value exceed total supply', function () {
            expect(() => cro.coin.Coin.fromBaseUnit('10000000000000000001')).to.throw(
                'Expected base amount to be within total supply',
            );
        });

        it('should return a coins object of the provided base unit string', function () {
            const anyBaseValue = '1000';
            const coins = cro.coin.Coin.fromBaseUnit(anyBaseValue);

            expect(coins.toString()).to.eq(anyBaseValue);
        });
    });

    describe('fromCRO', function () {
        fuzzyDescribe('should throw Error when the provided value is not a string', function (fuzzy) {
            const testRunner = fuzzy(fuzzy.StringArg('0.1'));
            testRunner(
                function (arg) {
                    expect(() => cro.coin.Coin.fromCRO(arg.value)).to.throw('Expected `amount` to be of type `string`');
                },
                { invalidArgsOnly: true },
            );
        });

        it('should throw Error when the provided string is not a valid number', function () {
            expect(() => cro.coin.Coin.fromCRO('invalid')).to.throw(
                'Expected amount to be a base10 number represented as string',
            );
        });

        it('should throw Error when the provided string exceeds 8 decimal places', function () {
            expect(() => cro.coin.Coin.fromCRO('1000.123456789')).to.throw(
                'Expected CRO amount to have at most 8 decimal places',
            );
            expect(() => cro.coin.Coin.fromCRO('-1000.123456789')).to.throw(
                'Expected CRO amount to have at most 8 decimal places',
            );
        });

        it('should throw Error when the provided string is not a base10 number', function () {
            expect(() => cro.coin.Coin.fromCRO('0xff')).to.throw(
                'Expected amount to be a base10 number represented as string',
            );
        });

        it('should throw Error when the provided string is a negative integer', function () {
            expect(() => cro.coin.Coin.fromCRO('-1000')).to.throw('Expected CRO amount to be positive');
        });

        it('should throw Error if the value exceed total supply', function () {
            expect(() => cro.coin.Coin.fromCRO('10000000000000000001')).to.throw(
                'Expected CRO amount to be within total supply',
            );
        });

        it('should return a coins object of the provided CRO unit string', function () {
            const anyCROValue = '0.00001';
            const coins = cro.coin.Coin.fromCRO(anyCROValue);

            const expectedBaseValue = '1000';
            expect(coins.toString()).to.eq(expectedBaseValue);
        });
    });

    describe('add', function () {
        fuzzyDescribe('should throw Error when the provided coins is not an instance of Coin', function (fuzzy) {
            const anyValidCoin = cro.coin.Coin.fromBaseUnit('1000');
            const testRunner = fuzzy(fuzzy.ObjArg(anyValidCoin));
            testRunner(
                function (arg) {
                    const anyCoin = cro.coin.Coin.fromBaseUnit('1000');

                    let expectedErrMsg: string;
                    if (arg.type === fuzzy.Object) {
                        expectedErrMsg = 'Expected argument to be an instance of `Coin`';
                    } else {
                        expectedErrMsg = 'Expected argument to be of type `object`';
                    }
                    expect(() => anyCoin.add(arg.value)).to.throw(expectedErrMsg);
                },
                { invalidArgsOnly: true },
            );
        });

        it('should throw Error when the result exceeds total supply', function () {
            const totalSupply = cro.coin.Coin.TOTAL_SUPPLY;
            const oneBaseUnit = cro.coin.Coin.fromBaseUnit('1');

            expect(() => totalSupply.add(oneBaseUnit)).to.throw('Adding two Coin together exceed total supply');
        });

        it('should return the sum of the two coins', function () {
            const anyCoin = cro.coin.Coin.fromBaseUnit('1000');
            const anyAnotherCoin = cro.coin.Coin.fromBaseUnit('10000000');

            expect(anyCoin.add(anyAnotherCoin).toString()).to.eq('10001000');
        });

        it('should return a cro.coins without modifying the original coins', function () {
            const anyCoinValue = '1000';
            const anyCoin = cro.coin.Coin.fromBaseUnit(anyCoinValue);
            const anyAnotherCoin = cro.coin.Coin.fromBaseUnit('10000000');

            anyCoin.add(anyAnotherCoin);
            expect(anyCoin.toString()).to.eq(anyCoinValue);
        });
    });

    describe('sub', function () {
        fuzzyDescribe('should throw Error when the provided coins is not an instance of Coin', function (fuzzy) {
            const anyValidCoin = cro.coin.Coin.fromBaseUnit('1000');
            const testRunner = fuzzy(fuzzy.ObjArg(anyValidCoin));
            testRunner(
                function (arg) {
                    const anyCoin = cro.coin.Coin.fromBaseUnit('1000');

                    let expectedErrMsg: string;
                    if (arg.type === fuzzy.Object) {
                        expectedErrMsg = 'Expected argument to be an instance of `Coin`';
                    } else {
                        expectedErrMsg = 'Expected argument to be of type `object`';
                    }
                    expect(() => anyCoin.sub(arg.value)).to.throw(expectedErrMsg);
                },
                { invalidArgsOnly: true },
            );
        });

        it('should throw Error when the result is negative', function () {
            const oneBaseUnit = cro.coin.Coin.fromBaseUnit('1');
            const twoBaseUnit = cro.coin.Coin.fromBaseUnit('2');

            expect(() => oneBaseUnit.sub(twoBaseUnit)).to.throw('Subtracting the Coin results in negation Coin');
        });

        it('should return the result of subtracting Coin with the provided Coin', function () {
            const anyCoin = cro.coin.Coin.fromBaseUnit('10006000');
            const anyAnotherCoin = cro.coin.Coin.fromBaseUnit('1000');

            expect(anyCoin.sub(anyAnotherCoin).toString()).to.eq('10005000');
        });

        it('should return a cro.coins without modifying the original coins', function () {
            const anyCoinValue = '10006000';
            const anyCoin = cro.coin.Coin.fromBaseUnit(anyCoinValue);
            const anyAnotherCoin = cro.coin.Coin.fromBaseUnit('1000');

            anyCoin.sub(anyAnotherCoin);
            expect(anyCoin.toString()).to.eq(anyCoinValue);
        });
    });

    describe('toCosmosCoin', function () {
        it('should return the Cosmos Coin object', function () {
            const anyCoin = cro.coin.Coin.fromBaseUnit('1000');
            expect(anyCoin.toCosmosCoin()).to.deep.eq({
                amount: '1000',
                denom: CroSDK.Testnet.coin.baseDenom,
            });
        });
    });

    describe('toString', function () {
        fuzzyDescribe('should throw Error when the provided unit is not a string', function (fuzzy) {
            const testRunner = fuzzy(fuzzy.optional(fuzzy.String)(cro.coin.Coin.UNIT_BASE));
            testRunner(
                function (arg) {
                    const anyCoin = cro.coin.Coin.fromBaseUnit('1000');
                    expect(() => anyCoin.toString(arg.value)).to.throw('Expected argument to be of type `string`');
                },
                { invalidArgsOnly: true },
            );
        });

        it('should throw Error when the provided unit is invalid', function () {
            const anyCoin = cro.coin.Coin.fromBaseUnit('1000');

            expect(() => anyCoin.toString('invalid' as any)).to.throw('Expected string to be one of the Coin units');
        });

        it('should return the base unit when no unit is provided', function () {
            const anyBaseValue = '1000';
            const coins = cro.coin.Coin.fromBaseUnit(anyBaseValue);

            expect(coins.toString()).to.eq(anyBaseValue);
        });

        it('should return the base unit when unit is base', function () {
            const anyBaseValue = '1000';
            const coins = cro.coin.Coin.fromBaseUnit(anyBaseValue);

            expect(coins.toString(cro.coin.Coin.UNIT_BASE)).to.eq(anyBaseValue);
        });

        it('should return the CRO value when unit is CRO', function () {
            const anyBaseValue = '1000';
            const coins = cro.coin.Coin.fromBaseUnit(anyBaseValue);

            const expectedCROValue = '0.00001';
            expect(coins.toString(cro.coin.Coin.UNIT_CRO)).to.eq(expectedCROValue);
        });

        it('should return the CRO value when unit is CRO and has 8 decimal places', function () {
            const anyBaseValue = '12345678';
            const coins = cro.coin.Coin.fromBaseUnit(anyBaseValue);

            const expectedCROValue = '0.12345678';
            expect(coins.toString(cro.coin.Coin.UNIT_CRO)).to.eq(expectedCROValue);
        });
    });
});
