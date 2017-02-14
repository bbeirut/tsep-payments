import {cleanInput} from '../../../utils/parsing';

const cardTypes = [
  {
    name: 'VISA',
    displayName: 'Visa',
    lengths: [13, 16],
    prefixExpression: '4'
  },
  {
    name: 'MASTERCARD',
    displayName: 'MasterCard',
    lengths: [16],
    prefixExpression: '5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720'
  },
  {
    name: 'AMERICAN_EXPRESS',
    displayName: 'American Express',
    lengths: [15],
    prefixExpression: '3[4,7]'
  },
  {
    name: 'DISCOVER',
    displayName: 'Discover',
    lengths: [16],
    prefixExpression: '65|64[4-9]|622|6011|35[2-8]'
  },
  {
    name: 'DINERS_CLUB',
    displayName: 'Diners Club',
    lengths: [14],
    prefixExpression: '36|30[0-5]'
  }
];

export function validateKnownType(cardNumber: string){
  return !!getCardType(cardNumber);
}

export function validateTypeLength(cardNumber: string){
  return lengthValid(getCardType(cardNumber), cardNumber);
}

export function getCardTypeName(cardNumber: string){
  const cardType = getCardType(cardNumber);
  return cardType ? cardType.displayName : '';
}

export function expectedLength(cardNumber: string){
  const cardType = getCardType(cleanInput(cardNumber));
  return cardType && cardType.lengths;
}

function getCardType(cardNumber: string) {
  for(const cardType of cardTypes) {
    const cardExpression = new RegExp('^(' + cardType.prefixExpression + ')');
    if(cardExpression.test(cardNumber)){
      return cardType;
    }
  }
}

function lengthValid(cardType: any, cardNumber: string) {
  if(cardType && cardType.lengths){
    for(const length of cardType.lengths){
      if(length === cardNumber.length)
        return true;
    }
  }
  return false;
}

