
export class NumberConst{
    zero= 0;
    one = 1;
    two = 2;    
    three = 3;
    four = 4;
}

export class TextConst{
    asterisk = "*";
    empty = "";
    zero = "0";
    one = "1";
    two = "2";
    eighteen = "18";
    sixtySix = "66";
    sixtyEight = "68";
    eighty = "80";
    letterA = 'a';
    letterG = 'g';
    placeholderPhone = "60 - 1 - ___ - __ - __";
    placeholderCell = "+57 - ___ - _ - __ - __ - __";
    maskPhone = "99 - 9 - 999 - 99 - 99";
    maskCell = "+99 - 999 - 9 - 99 - 99 - 99";
    characterCross = '+'; 
    replaceLine = /-/g;
    replaceSpace = / /g;
    replaceSpace2 = /  /g;
    onlyNumber=/^[0-9]$/;
    onlyNumbers=/^([0-9])*$/;
    onlyText = /(\d+)/;
    onlyNumbersDecimal = /^[0-9]+([.])?([0-9]+)?$/;
    idTypes = [
      { code: '11', meaning: 'Registro civil' },
      { code: '12', meaning: 'Tarjeta de identidad' },
      { code: '13', meaning: 'Cédula de extranjería' },
      { code: '21', meaning: 'Tarjeta de extranjería' }
    ];
}

export class DataList{    
  listAlphabet: any[] = [
    {nombre: 'A'},
    {nombre: 'B'},
    {nombre: 'C'},
    {nombre: 'D'},
    {nombre: 'E'},
    {nombre: 'F'},
    {nombre: 'G'},
    {nombre: 'H'},
    {nombre: 'I'},
    {nombre: 'J'},
    {nombre: 'K'},
    {nombre: 'L'},
    {nombre: 'M'},
    {nombre: 'N'},
    {nombre: 'O'},
    {nombre: 'P'},
    {nombre: 'Q'},
    {nombre: 'R'},
    {nombre: 'S'},
    {nombre: 'T'},
    {nombre: 'U'},
    {nombre: 'V'},
    {nombre: 'W'},
    {nombre: 'X'},
    {nombre: 'Y'},
    {nombre: 'Z'}    
  ];

  listCoordinate:any[]=[
    {nombre: 'Norte', id: 'N'},
    {nombre: 'Sur', id: 'S'},
    {nombre: 'Este', id: 'E'},
    {nombre: 'Oeste', id: 'W'},
    {nombre: 'Bis', id: 'B'}
  ]

  listAddress: any[] = [
    {nombre: 'Autopista', id: 'AU'},
    {nombre: 'Avenida', id: 'AV'},
    {nombre: 'Avenida_Calle', id: 'AC'},
    {nombre: 'Avenida_Carrera', id: 'AK'},
    {nombre: 'Bulevar', id: 'BL'},
    {nombre: 'Calle', id: 'CL'},
    {nombre: 'Carrera', id: 'KR'},
    {nombre: 'Carretera', id: 'CT'},
    {nombre: 'Circular', id: 'CQ'},
    {nombre: 'Circunvalar', id: 'CV'},
    {nombre: 'Cuentas_Corridas', id: 'CC'},
    {nombre: 'Diagonal', id: 'DG'},
    {nombre: 'Pasaje', id: 'PJ'},
    {nombre: 'Paseo', id: 'PS'},
    {nombre: 'Peatonal', id: 'PT'},
    {nombre: 'Transversal', id: 'TV'},
    {nombre: 'Troncal', id: 'TC'},
    {nombre: 'Variante', id: 'VT'},
    {nombre: 'Via', id: 'VI'},
  ];
  
  aplicacionImpuesto:any[] = [
    {id: 1, nombre: 'Nacional'},
    {id: 2, nombre: 'Departamental'},
    {id: 3, nombre: 'Municipal'}
  ];
}