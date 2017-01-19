import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {cleanInput} from '../utils/parsing';
import * as cardNumberModule from './card-number/card-number';
import {validateMinLength as cvvValidateMinLength, validateMaxLength as cvvValidateMaxLength, validateAll as cvvValidateAll} from './cvv/cvv';
import {validateMonth, validateYear} from './expiry-date/expiry-date';
import {encrypt as tsysEncrypt} from '../payment-providers/tsys/tsys';

export {init} from '../payment-providers/tsys/tsys';

export const card = {
  validate: {
    minLength: cardNumberModule.validateMinLength,
    maxLength: cardNumberModule.validateMaxLength,
    knownType: cardNumberModule.validateKnownType,
    typeLength: cardNumberModule.validateTypeLength,
    checksum: cardNumberModule.validateChecksum,
    all: cardNumberModule.validateAll
  },
  errors:cardNumberModule.errors,
  info: {
    type: cardNumberModule.getCardType,
    expectedLengthForType: cardNumberModule.expectedLengthForType
  }
};

export const cvv = {
  validate: {
    minLength: cvvValidateMinLength,
    maxLength: cvvValidateMaxLength,
    all: cvvValidateAll
  }
};

export const expiryDate = {
  validate: {
    month: validateMonth,
    year: validateYear,
    all: validateMonth
  }
};

export function validate(cardNumber: string|number, cvvInput: string|number, month: string|number, year: string|number){
  return card.validate.all(cardNumber) &&
    cvv.validate.all(cvvInput) &&
    expiryDate.validate.all(month, year);
}

export function encrypt(cardNumber: string|number, cvv: string|number, month: string|number, year: string|number){
  if(!validate(cardNumber, cvv, month, year)){
    return Observable.throw('Credit card details invalid');
  }
  return tsysEncrypt(cleanInput(cardNumber), cleanInput(cvv), Number(cleanInput(month)), Number(cleanInput(year)));
}
